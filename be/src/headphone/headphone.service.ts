import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { Headphone } from "./entities/headphone.entity";
import { CreateHeadphoneDto } from "./dto/create-headphone.dto";
import { UpdateHeadphoneDto } from "./dto/update-headphone.dto";

const unlinkAsync = promisify(fs.unlink);

// Service xử lý logic nghiệp vụ cho module headphone
@Injectable()
export class HeadphoneService {
  constructor(
    // Inject model headphone để tương tác với MongoDB
    @InjectModel(Headphone.name)
    private readonly headphoneModel: Model<Headphone>
  ) {}

  // Tạo mới một headphone
  async create(
    createHeadphoneDto: CreateHeadphoneDto,
    files: Express.Multer.File[]
  ): Promise<Headphone> {
    // Kiểm tra số lượng file ảnh có khớp với số lượng biến thể màu không
    if (files.length !== createHeadphoneDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    // Xử lý các file ảnh được upload
    const colorVariants = createHeadphoneDto.colorVariants.map(
      (variant, index) => {
        if (!files[index]) {
          throw new NotFoundException(`Thiếu ảnh cho màu ${variant.color}`);
        }
        return {
          color: variant.color,
          image: `/image/${files[index].filename}`,
          stock: variant.stock,
        };
      }
    );

    // Tính toán totalStock từ colorVariants
    const calculatedTotalStock = colorVariants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );

    // Tính toán isPromotion và finalPrice
    const isPromotion = createHeadphoneDto.promotion > 0;
    const finalPrice =
      createHeadphoneDto.startingPrice *
      (1 - createHeadphoneDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    // Tạo document mới
    const headphone = new this.headphoneModel({
      ...createHeadphoneDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });

    // Lưu document vào MongoDB
    return await headphone.save();
  }

  // Lấy danh sách tất cả headphone
  async findAll(): Promise<Headphone[]> {
    return await this.headphoneModel.find().exec();
  }

  // Lấy thông tin một headphone theo ID
  async findOne(id: string): Promise<Headphone> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const headphone = await this.headphoneModel.findById({ _id: id }).exec();
    if (!headphone) {
      throw new BadRequestException("Không tìm thấy headphone");
    }
    return headphone;
  }

  // Cập nhật thông tin headphone
  async update(
    id: string,
    updateHeadphoneDto: UpdateHeadphoneDto,
    files?: Express.Multer.File[]
  ): Promise<Headphone> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra headphone có tồn tại không
    const headphone = await this.findOne(id);
    if (!headphone) {
      throw new NotFoundException("Không tìm thấy headphone để cập nhật");
    }

    let colorVariants = headphone.colorVariants;

    if (updateHeadphoneDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateHeadphoneDto.colorVariants;
      let fileIndex = 0; // Theo dõi index của file trong mảng files

      // Xác định các ảnh cũ có thể cần xóa
      const oldImagesToCheck = headphone.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true" // Có ảnh mới cho màu này
          )
        )
        .map((variant) => variant.image);

      // Kiểm tra xem ảnh cũ có được sử dụng bởi sản phẩm khác không
      const imagesInUse = await this.headphoneModel
        .find({
          "colorVariants.image": { $in: oldImagesToCheck },
          _id: { $ne: id },
        })
        .exec();

      const imagesInUseSet = new Set(
        imagesInUse.flatMap((m) => m.colorVariants.map((v) => v.image))
      );
      const oldImagesToDelete = oldImagesToCheck.filter(
        (image) => !imagesInUseSet.has(image)
      );

      // Xóa ảnh cũ không còn được sử dụng
      if (oldImagesToDelete.length > 0) {
        await Promise.all(
          oldImagesToDelete.map((imagePath) =>
            unlinkAsync(`.${imagePath}`).catch((err) =>
              console.error(`Không thể xóa ảnh cũ ${imagePath}:`, err)
            )
          )
        );
      }

      // Cập nhật colorVariants với thông tin mới
      colorVariants = newColorVariants.map((variant) => {
        const existingVariant = headphone.colorVariants.find(
          (v) => v.color === variant.color
        );
        let image = variant.existingImage || existingVariant?.image || "";

        // Nếu biến thể này có ảnh mới
        if (variant.hasNewImage === "true" && files && files[fileIndex]) {
          image = `/image/${files[fileIndex].filename}`;
          fileIndex++; // Tăng index để lấy file tiếp theo
        }

        return {
          color: variant.color,
          image,
          stock: variant.stock ?? existingVariant?.stock ?? 0,
        };
      });
    }

    const totalStock = colorVariants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );

    // Tính toán isPromotion và finalPrice
    const promotion =
      updateHeadphoneDto.promotion !== undefined
        ? updateHeadphoneDto.promotion
        : headphone.promotion;
    const startingPrice =
      updateHeadphoneDto.startingPrice !== undefined
        ? updateHeadphoneDto.startingPrice
        : headphone.startingPrice;
    const isPromotion = promotion > 0;
    const finalPrice = startingPrice * (1 - promotion / 100);

    // Cập nhật document với các giá trị tính toán
    const updatedData = {
      ...updateHeadphoneDto,
      totalStock,
      isPromotion,
      finalPrice,
      colorVariants,
      isAvailable: totalStock > 0,
    };

    // Cập nhật document trong MongoDB
    const updatedheadphone = await this.headphoneModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (!updatedheadphone) {
      throw new BadRequestException("Không tìm thấy headphone để cập nhật");
    }

    return updatedheadphone;
  }

  // Xóa một headphone
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra headphone có tồn tại không
    const headphone = await this.headphoneModel.findById(id).exec();
    if (!headphone) throw new NotFoundException("Không tìm thấy headphone");

    const imagePaths = headphone.colorVariants.map((variant) => variant.image);
    if (imagePaths.length > 0) {
      await Promise.all(
        imagePaths.map((imagePath) =>
          unlinkAsync(`.${imagePath}`).catch((err) =>
            console.error(`Không thể xóa ảnh ${imagePath}:`, err)
          )
        )
      );
    }

    // Xóa document khỏi MongoDB
    return await this.headphoneModel.findByIdAndDelete(id).exec();
  }

  async getAllBrand(): Promise<string[]> {
    const headphones = await this.headphoneModel.find().exec();
    const brands = new Array<string>();
    headphones.forEach((headphone) => {
      if (headphone.brand) {
        brands.push(headphone.brand);
      }
    });
    return Array.from(brands);
  }

  async getAllheadphoneByBrand(brand: string): Promise<Headphone[]> {
    const headphones = await this.headphoneModel.find({ brand }).exec();
    if (!headphones || headphones.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy headphone nào cho thương hiệu này"
      );
    }
    return headphones;
  }
}
