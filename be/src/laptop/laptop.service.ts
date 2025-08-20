import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Laptop } from "./entities/laptop.entity";
import { CreateLaptopDto } from "./dto/create-laptop.dto";
import { UpdateLaptopDto } from "./dto/update-laptop.dto";
import * as fs from "fs";
import { promisify } from "util";
import { ApiResponse } from "src/common/types/api";

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class LaptopService {
  constructor(
    @InjectModel(Laptop.name)
    private readonly laptopModel: Model<Laptop>
  ) {}

  async create(
    createLaptopDto: CreateLaptopDto,
    files: Express.Multer.File[]
  ): Promise<ApiResponse<Laptop>> {
    if (files.length !== createLaptopDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    const colorVariants = createLaptopDto.colorVariants.map(
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

    const isPromotion = createLaptopDto.promotion > 0;
    const finalPrice =
      createLaptopDto.startingPrice * (1 - createLaptopDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    const laptop = new this.laptopModel({
      ...createLaptopDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });

    await laptop.save();

    return {
      success: true,
      message: "Tạo laptop thành công",
      data: laptop,
    };
  }

  async findAll(): Promise<ApiResponse<Laptop[]>> {
    const laptops = await this.laptopModel.find().exec();
    return {
      success: true,
      message: "Lấy danh sách laptop thành công",
      data: laptops,
    };
  }

  async findByPromotion(): Promise<ApiResponse<Laptop[]>> {
    const laptops = await this.laptopModel.find({ isPromotion: true });
    return {
      success: true,
      message: "Lấy danh sách laptop khuyến mãi thành công",
      data: laptops,
    };
  }

  async findOne(id: string): Promise<ApiResponse<Laptop>> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const laptop = await this.laptopModel.findById({ _id: id }).exec();
    if (!laptop) {
      throw new BadRequestException("Không tìm thấy laptop");
    }
    return {
      success: true,
      message: "Lấy thông tin laptop thành công",
      data: laptop,
    };
  }

  async update(
    id: string,
    updateLaptopDto: UpdateLaptopDto,
    files?: Express.Multer.File[]
  ): Promise<ApiResponse<Laptop>> {
    const result = await this.findOne(id);

    const laptop = result.data;

    let colorVariants = laptop.colorVariants;

    if (updateLaptopDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateLaptopDto.colorVariants;
      let fileIndex = 0;

      const oldImagesToCheck = laptop.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true"
          )
        )
        .map((variant) => variant.image);

      const imagesInUse = await this.laptopModel
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
        const existingVariant = laptop.colorVariants.find(
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
      ...updateLaptopDto,
      totalStock,
      isPromotion: updateLaptopDto.promotion > 0,
      finalPrice:
        updateLaptopDto.startingPrice * (1 - updateLaptopDto.promotion / 100),
      colorVariants,
      promotion: updateLaptopDto.promotion,
      isAvailable: totalStock > 0,
    };

    Object.assign(laptop, updatedData);

    const updatedLaptop = await laptop.save();

    return {
      success: true,
      data: updatedLaptop,
      message: "Cập nhật laptop thành công",
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID không hợp lệ");
    }
    const laptop = await this.laptopModel.findByIdAndDelete(id).exec();

    if (!laptop) {
      throw new NotFoundException("Laptop không tồn tại");
    }
    const imagePaths = laptop.colorVariants.map((variant) => variant.image);
    if (imagePaths.length > 0) {
      await Promise.all(
        imagePaths.map((imagePath) =>
          unlinkAsync(`.${imagePath}`).catch((err) =>
            console.error(`Không thể xóa ảnh ${imagePath}:`, err)
          )
        )
      );
    }

    return {
      success: true,
      message: "Xóa laptop thành công",
      data: null,
    };
  }

  async getAllBrand(): Promise<ApiResponse<string[]>> {
    const laptops = await this.laptopModel.find().exec();
    const brands = new Set<string>();
    laptops.forEach((laptop) => {
      if (laptop.brand) {
        brands.add(laptop.brand);
      }
    });
    return {
      success: true,
      message: "Lấy danh sách thương hiệu thành công",
      data: Array.from(brands),
    };
  }

  async getAllLaptopByBrand(brand: string): Promise<ApiResponse<Laptop[]>> {
    const laptops = await this.laptopModel.find({ brand }).exec();
    if (!laptops || laptops.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy laptop nào cho thương hiệu này"
      );
    }
    return {
      success: true,
      message: "Lấy danh sách laptop theo thương hiệu thành công",
      data: laptops,
    };
  }
}
