import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Mobile } from "./entities/mobiles.entity";
import { CreateMobileDto } from "./dto/create-mobiles.dto";
import { UpdateMobileDto } from "./dto/update-mobiles.dto";
import * as fs from "fs";
import { promisify } from "util";
import { ApiResponse } from "src/common/types/api";

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class MobilesService {
  constructor(@InjectModel(Mobile.name) private mobileModel: Model<Mobile>) {}

  async create(
    createMobileDto: CreateMobileDto,
    files: Express.Multer.File[]
  ): Promise<ApiResponse<Mobile>> {
    console.log("Creating:", createMobileDto);
    if (files.length !== createMobileDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    const colorVariants = createMobileDto.colorVariants.map(
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

    const isPromotion = createMobileDto.promotion > 0;
    const finalPrice =
      createMobileDto.startingPrice * (1 - createMobileDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    const mobile = new this.mobileModel({
      ...createMobileDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      finalPrice,
      isPromotion,
      isAvailable,
    });
    mobile.save();
    return { data: mobile, message: "Tạo Mobile thành công", success: true };
  }

  async findAll(): Promise<ApiResponse<Mobile[]>> {
    const mobiles = await this.mobileModel.find().exec();
    return {
      success: true,
      message: "Lấy danh sách Mobile thành công",
      data: mobiles,
    };
  }

  async findByPromotion(): Promise<ApiResponse<Mobile[]>> {
    const mobiles = await this.mobileModel.find({ isPromotion: true }).exec();
    return {
      success: true,
      message: "Lấy danh sách Mobile khuyến mãi thành công",
      data: mobiles,
    };
  }

  async findOne(id: string): Promise<ApiResponse<Mobile>> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException("ID không hợp lệ");
    const mobile = await this.mobileModel.findById(id).exec();
    if (!mobile) throw new NotFoundException("Mobile không tồn tại");
    return {
      success: true,
      message: "Lấy thông tin Mobile thành công",
      data: mobile,
    };
  }

  async update(
    id: string,
    updateMobileDto: UpdateMobileDto,
    files?: Express.Multer.File[]
  ): Promise<ApiResponse<Mobile>> {
    const result = await this.findOne(id);

    const mobile = result.data;

    let colorVariants = mobile.colorVariants;

    if (updateMobileDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateMobileDto.colorVariants;
      let fileIndex = 0;

      const oldImagesToCheck = mobile.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true"
          )
        )
        .map((variant) => variant.image);

      const imagesInUse = await this.mobileModel
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
        const existingVariant = mobile.colorVariants.find(
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

    const updateData = {
      ...updateMobileDto,
      finalPrice:
        updateMobileDto.startingPrice * (1 - updateMobileDto.promotion / 100),
      isPromotion: updateMobileDto.promotion > 0,
      colorVariants,
      totalStock,
      isAvailable: totalStock > 0,
    };

    Object.assign(mobile, updateData);

    const updatedMobile = await mobile.save();

    return {
      data: updatedMobile,
      message: "Cập nhật mobile thành công",
      success: true,
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");

    const mobile = await this.mobileModel.findByIdAndDelete(id).exec();
    if (!mobile) throw new NotFoundException("Không tìm thấy Mobile");

    // Xóa tất cả ảnh trong thư mục
    const imagePaths = mobile.colorVariants.map((variant) => variant.image);
    if (imagePaths.length > 0) {
      await Promise.all(
        imagePaths.map((imagePath) =>
          unlinkAsync(`.${imagePath}`).catch((err) =>
            console.error(`Không thể xóa ảnh ${imagePath}:`, err)
          )
        )
      );
    }

    // Xóa bản ghi trong database
    return {
      data: null,
      message: "Xóa mobile thành công",
      success: true,
    };
  }

  async getAllBrand(): Promise<ApiResponse<string[]>> {
    const mobiles = await this.mobileModel.find().exec();
    const brands = new Set<string>();
    mobiles.forEach((mobile) => {
      if (mobile.brand) {
        brands.add(mobile.brand);
      }
    });
    return {
      data: Array.from(brands),
      message: "Lấy danh sách thương hiệu thành công",
      success: true,
    };
  }

  async getAllMobileByBrand(brand: string): Promise<ApiResponse<Mobile[]>> {
    const mobiles = await this.mobileModel.find({ brand }).exec();
    if (!mobiles || mobiles.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy mobile nào cho thương hiệu này"
      );
    }
    return {
      data: mobiles,
      success: true,
      message: "Lấy danh sách mobile theo thương hiệu thành công",
    };
  }
}
