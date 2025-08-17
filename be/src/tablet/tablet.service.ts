import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as fs from "fs";
import { promisify } from "util";
import { Tablet } from "./entities/tablet.entity";
import { CreateTabletDto } from "./dto/create-tablet.dto";
import { UpdateTabletDto } from "./dto/update-tablet.dto";
import { a } from "framer-motion/dist/types.d-B50aGbjN";

const unlinkAsync = promisify(fs.unlink);

// Service xử lý logic nghiệp vụ cho module tablet
@Injectable()
export class TabletService {
  constructor(
    // Inject model tablet để tương tác với MongoDB
    @InjectModel(Tablet.name)
    private readonly tabletModel: Model<Tablet>
  ) {}

  // Tạo mới một tablet
  async create(
    createTabletDto: CreateTabletDto,
    files: Express.Multer.File[]
  ): Promise<Tablet> {
    // Kiểm tra số lượng file ảnh có khớp với số lượng biến thể màu không
    if (files.length !== createTabletDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    // Xử lý các file ảnh được upload
    const colorVariants = createTabletDto.colorVariants.map(
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
    const isPromotion = createTabletDto.promotion > 0;
    const finalPrice =
      createTabletDto.startingPrice * (1 - createTabletDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    // Tạo document mới
    const tablet = new this.tabletModel({
      ...createTabletDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });

    // Lưu document vào MongoDB
    return await tablet.save();
  }

  // Lấy danh sách tất cả tablet
  async findAll(): Promise<Tablet[]> {
    return await this.tabletModel.find().exec();
  }

  async findByPromotion() {
    return await this.tabletModel.find({ isPromotion: true }).exec();
  }

  // Lấy thông tin một tablet theo ID
  async findOne(id: string): Promise<Tablet> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const tablet = await this.tabletModel.findById({ _id: id }).exec();
    if (!tablet) {
      throw new BadRequestException("Không tìm thấy tablet");
    }
    return tablet;
  }

  // Cập nhật thông tin tablet
  async update(
    id: string,
    updateTabletDto: UpdateTabletDto,
    files?: Express.Multer.File[]
  ): Promise<Tablet> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra tablet có tồn tại không
    const tablet = await this.findOne(id);
    if (!tablet) {
      throw new NotFoundException("Không tìm thấy tablet để cập nhật");
    }

    let colorVariants = tablet.colorVariants;

    if (updateTabletDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateTabletDto.colorVariants;
      let fileIndex = 0; // Theo dõi index của file trong mảng files

      // Xác định các ảnh cũ có thể cần xóa
      const oldImagesToCheck = tablet.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true" // Có ảnh mới cho màu này
          )
        )
        .map((variant) => variant.image);

      // Kiểm tra xem ảnh cũ có được sử dụng bởi sản phẩm khác không
      const imagesInUse = await this.tabletModel
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
        const existingVariant = tablet.colorVariants.find(
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
      updateTabletDto.promotion !== undefined
        ? updateTabletDto.promotion
        : tablet.promotion;
    const startingPrice =
      updateTabletDto.startingPrice !== undefined
        ? updateTabletDto.startingPrice
        : tablet.startingPrice;
    const isPromotion = promotion > 0;
    const finalPrice = startingPrice * (1 - promotion / 100);

    // Cập nhật document với các giá trị tính toán
    const updatedData = {
      ...updateTabletDto,
      totalStock,
      isPromotion,
      finalPrice,
      colorVariants,
      isAvailable: totalStock > 0,
    };

    // Cập nhật document trong MongoDB
    const updatedTablet = await this.tabletModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (!updatedTablet) {
      throw new BadRequestException("Không tìm thấy tablet để cập nhật");
    }

    return updatedTablet;
  }

  // Xóa một tablet
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra tablet có tồn tại không
    const tablet = await this.tabletModel.findById(id).exec();
    if (!tablet) throw new NotFoundException("Không tìm thấy tablet");

    const imagePaths = tablet.colorVariants.map((variant) => variant.image);
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
    return await this.tabletModel.findByIdAndDelete(id).exec();
  }

  async getAllBrand(): Promise<string[]> {
    const laptops = await this.tabletModel.find().exec();
    const brands = new Array<string>();
    laptops.forEach((tablet) => {
      if (tablet.brand) {
        brands.push(tablet.brand);
      }
    });
    return Array.from(brands);
  }

  async getAllTabletByBrand(brand: string): Promise<Tablet[]> {
    const laptops = await this.tabletModel.find({ brand }).exec();
    if (!laptops || laptops.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy tablet nào cho thương hiệu này"
      );
    }
    return laptops;
  }
}
