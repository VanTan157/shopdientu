import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as fs from "fs";
import { promisify } from "util";
import { Headphone } from "./entities/headphone.entity";
import { CreateHeadphoneDto } from "./dto/create-headphone.dto";
import { UpdateHeadphoneDto } from "./dto/update-headphone.dto";
import { ApiResponse } from "src/common/types/api";

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class HeadphoneService {
  constructor(
    @InjectModel(Headphone.name)
    private readonly headphoneModel: Model<Headphone>
  ) {}

  async create(
    createHeadphoneDto: CreateHeadphoneDto,
    files: Express.Multer.File[]
  ): Promise<ApiResponse<Headphone>> {
    if (files.length !== createHeadphoneDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }
    const colorVariants = createHeadphoneDto.colorVariants.map(
      (variant, index) => {
        if (!files[index]) {
          throw new BadRequestException(`Thiếu ảnh cho màu ${variant.color}`);
        }
        return {
          color: variant.color,
          image: `/image/${files[index].filename}`,
          stock: variant.stock,
        };
      }
    );

    const calculatedTotalStock = colorVariants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );

    const isPromotion = createHeadphoneDto.promotion > 0;
    const finalPrice =
      createHeadphoneDto.startingPrice *
      (1 - createHeadphoneDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    const headphone = new this.headphoneModel({
      ...createHeadphoneDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });
    await headphone.save();
    return {
      success: true,
      message: "Tạo mới headphone thành công",
      data: headphone,
    };
  }

  async findAll(): Promise<ApiResponse<Headphone[]>> {
    const headphones = await this.headphoneModel.find().exec();
    return {
      success: true,
      message: "Lấy danh sách headphone thành công",
      data: headphones,
    };
  }

  async findByPromotion(): Promise<ApiResponse<Headphone[]>> {
    const headphones = await this.headphoneModel.find({ isPromotion: true });
    return {
      success: true,
      message: "Lấy danh sách headphone khuyến mãi thành công",
      data: headphones,
    };
  }

  async findOne(id: string): Promise<ApiResponse<Headphone>> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const headphone = await this.headphoneModel.findById({ _id: id }).exec();
    if (!headphone) {
      throw new NotFoundException("Không tìm thấy headphone");
    }
    return {
      success: true,
      message: "Lấy thông tin headphone thành công",
      data: headphone,
    };
  }

  async update(
    id: string,
    updateHeadphoneDto: UpdateHeadphoneDto,
    files?: Express.Multer.File[]
  ): Promise<ApiResponse<Headphone>> {
    const result = await this.findOne(id);

    const headphone = result.data;

    let colorVariants = headphone.colorVariants;

    if (updateHeadphoneDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateHeadphoneDto.colorVariants;
      let fileIndex = 0;

      const oldImagesToCheck = headphone.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true"
          )
        )
        .map((variant) => variant.image);

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

      if (oldImagesToDelete.length > 0) {
        await Promise.all(
          oldImagesToDelete.map((imagePath) =>
            unlinkAsync(`.${imagePath}`).catch((err) =>
              console.error(`Không thể xóa ảnh cũ ${imagePath}:`, err)
            )
          )
        );
      }

      colorVariants = newColorVariants.map((variant) => {
        const existingVariant = headphone.colorVariants.find(
          (v) => v.color === variant.color
        );
        let image = variant.existingImage || existingVariant?.image || "";

        if (variant.hasNewImage === "true" && files && files[fileIndex]) {
          image = `/image/${files[fileIndex].filename}`;
          fileIndex++;
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

    const updatedData = {
      ...updateHeadphoneDto,
      totalStock,
      isPromotion: updateHeadphoneDto.promotion > 0,
      promotion: updateHeadphoneDto.promotion,
      finalPrice:
        updateHeadphoneDto.startingPrice *
        (1 - updateHeadphoneDto.promotion / 100),
      colorVariants,
      isAvailable: totalStock > 0,
    };

    Object.assign(headphone, updatedData);

    const updatedheadphone = await headphone.save();

    return {
      success: true,
      message: "Cập nhật headphone thành công",
      data: updatedheadphone,
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    const result = await this.findOne(id);
    const headphone = result.data;
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

    await this.headphoneModel.findByIdAndDelete(id).exec();

    return {
      success: true,
      message: "Xóa headphone thành công",
      data: null,
    };
  }

  async getAllBrand(): Promise<ApiResponse<string[]>> {
    const headphones = await this.headphoneModel.find().exec();
    const brands = new Set<string>();
    headphones.forEach((headphone) => {
      if (headphone.brand) {
        brands.add(headphone.brand);
      }
    });
    return {
      success: true,
      message: "Lấy danh sách thương hiệu thành công",
      data: Array.from(brands),
    };
  }

  async getAllheadphoneByBrand(
    brand: string
  ): Promise<ApiResponse<Headphone[]>> {
    const result = await this.getAllBrand();
    const brands = result.data;
    if (!brands.includes(brand)) {
      throw new NotFoundException("Không tìm thấy thương hiệu này");
    }
    const headphones = await this.headphoneModel.find({ brand }).exec();
    if (!headphones || headphones.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy headphone nào cho thương hiệu này"
      );
    }
    return {
      success: true,
      message: "Lấy danh sách headphone theo thương hiệu thành công",
      data: headphones,
    };
  }
}
