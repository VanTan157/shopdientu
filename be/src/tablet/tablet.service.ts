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
import { ApiResponse } from "src/common/types/api";

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class TabletService {
  constructor(
    @InjectModel(Tablet.name)
    private readonly tabletModel: Model<Tablet>
  ) {}

  // Tạo mới một tablet
  async create(
    createTabletDto: CreateTabletDto,
    files: Express.Multer.File[]
  ): Promise<ApiResponse<Tablet>> {
    if (files.length !== createTabletDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    const colorVariants = createTabletDto.colorVariants.map(
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

    const isPromotion = createTabletDto.promotion > 0;
    const finalPrice =
      createTabletDto.startingPrice * (1 - createTabletDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    const tablet = new this.tabletModel({
      ...createTabletDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });

    await tablet.save();

    return {
      success: true,
      message: "Tạo tablet thành công",
      data: tablet,
    };
  }

  async findAll(): Promise<ApiResponse<Tablet[]>> {
    const tablets = await this.tabletModel.find().exec();
    return {
      success: true,
      message: "Lấy danh sách tablet thành công",
      data: tablets,
    };
  }

  async findByPromotion(): Promise<ApiResponse<Tablet[]>> {
    const tablets = await this.tabletModel.find({ isPromotion: true }).exec();
    return {
      success: true,
      message: "Lấy danh sách tablet khuyến mãi thành công",
      data: tablets,
    };
  }

  async findOne(id: string): Promise<ApiResponse<Tablet>> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const tablet = await this.tabletModel.findById({ _id: id }).exec();
    if (!tablet) {
      throw new NotFoundException("Không tìm thấy tablet");
    }
    return {
      success: true,
      message: "Lấy thông tin tablet thành công",
      data: tablet,
    };
  }

  async update(
    id: string,
    updateTabletDto: UpdateTabletDto,
    files?: Express.Multer.File[]
  ): Promise<ApiResponse<Tablet>> {
    const result = await this.findOne(id);
    const tablet = result.data;

    let colorVariants = tablet.colorVariants;

    if (updateTabletDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateTabletDto.colorVariants;
      let fileIndex = 0;

      const oldImagesToCheck = tablet.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true"
          )
        )
        .map((variant) => variant.image);

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
        const existingVariant = tablet.colorVariants.find(
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
      ...updateTabletDto,
      totalStock,
      isPromotion: updateTabletDto.promotion > 0,
      finalPrice:
        updateTabletDto.startingPrice * (1 - updateTabletDto.promotion / 100),
      colorVariants,
      isAvailable: totalStock > 0,
    };

    Object.assign(tablet, updatedData);

    const updateTablet = await tablet.save();

    return {
      success: true,
      message: "Cập nhật tablet thành công",
      data: updateTablet,
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException("ID không hợp lệ");
    const tablet = await this.tabletModel.findByIdAndDelete(id).exec();
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

    return {
      success: true,
      message: "Xóa tablet thành công",
      data: null,
    };
  }

  async getAllBrand(): Promise<ApiResponse<string[]>> {
    const laptops = await this.tabletModel.find().exec();
    const brands = new Set<string>();
    laptops.forEach((tablet) => {
      if (tablet.brand) {
        brands.add(tablet.brand);
      }
    });
    return {
      success: true,
      message: "Lấy danh sách thương hiệu thành công",
      data: Array.from(brands),
    };
  }

  async getAllTabletByBrand(brand: string): Promise<ApiResponse<Tablet[]>> {
    const laptops = await this.tabletModel.find({ brand }).exec();
    if (!laptops || laptops.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy tablet nào cho thương hiệu này"
      );
    }
    return {
      success: true,
      data: laptops,
      message: "Lấy danh sách tablet theo thương hiệu thành công",
    };
  }
}
