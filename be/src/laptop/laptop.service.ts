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

const unlinkAsync = promisify(fs.unlink);

// Service xử lý logic nghiệp vụ cho module Laptop
@Injectable()
export class LaptopService {
  constructor(
    // Inject model Laptop để tương tác với MongoDB
    @InjectModel(Laptop.name)
    private readonly laptopModel: Model<Laptop>
  ) {}

  // Tạo mới một laptop
  async create(
    createLaptopDto: CreateLaptopDto,
    files: Express.Multer.File[]
  ): Promise<Laptop> {
    // Kiểm tra số lượng file ảnh có khớp với số lượng biến thể màu không
    if (files.length !== createLaptopDto.colorVariants.length) {
      throw new BadRequestException(
        "Số lượng file ảnh phải khớp với số lượng biến thể màu"
      );
    }

    // Xử lý các file ảnh được upload
    const colorVariants = createLaptopDto.colorVariants.map(
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
    const isPromotion = createLaptopDto.promotion > 0;
    const finalPrice =
      createLaptopDto.startingPrice * (1 - createLaptopDto.promotion / 100);
    const isAvailable = calculatedTotalStock > 0;

    // Tạo document mới
    const laptop = new this.laptopModel({
      ...createLaptopDto,
      colorVariants,
      totalStock: calculatedTotalStock,
      isPromotion,
      finalPrice,
      isAvailable,
    });

    // Lưu document vào MongoDB
    return await laptop.save();
  }

  // Lấy danh sách tất cả laptop
  async findAll(): Promise<Laptop[]> {
    return await this.laptopModel.find().exec();
  }

  // Lấy thông tin một laptop theo ID
  async findOne(id: string): Promise<Laptop> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    console.log("ID", id);
    const laptop = await this.laptopModel.findById({ _id: id }).exec();
    if (!laptop) {
      throw new BadRequestException("Không tìm thấy laptop");
    }
    return laptop;
  }

  // Cập nhật thông tin laptop
  async update(
    id: string,
    updateLaptopDto: UpdateLaptopDto,
    files?: Express.Multer.File[]
  ): Promise<Laptop> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra laptop có tồn tại không
    const laptop = await this.findOne(id);
    if (!laptop) {
      throw new NotFoundException("Không tìm thấy laptop để cập nhật");
    }

    let colorVariants = laptop.colorVariants;

    if (updateLaptopDto.colorVariants) {
      const newColorVariants: Array<{
        color: string;
        existingImage?: string;
        hasNewImage?: string;
        stock?: number;
      }> = updateLaptopDto.colorVariants;
      let fileIndex = 0; // Theo dõi index của file trong mảng files

      // Xác định các ảnh cũ có thể cần xóa
      const oldImagesToCheck = laptop.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color &&
              newVariant.hasNewImage === "true" // Có ảnh mới cho màu này
          )
        )
        .map((variant) => variant.image);

      // Kiểm tra xem ảnh cũ có được sử dụng bởi sản phẩm khác không
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
        const existingVariant = laptop.colorVariants.find(
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
      updateLaptopDto.promotion !== undefined
        ? updateLaptopDto.promotion
        : laptop.promotion;
    const startingPrice =
      updateLaptopDto.startingPrice !== undefined
        ? updateLaptopDto.startingPrice
        : laptop.startingPrice;
    const isPromotion = promotion > 0;
    const finalPrice = startingPrice * (1 - promotion / 100);

    // Cập nhật document với các giá trị tính toán
    const updatedData = {
      ...updateLaptopDto,
      totalStock,
      isPromotion,
      finalPrice,
      colorVariants,
      isAvailable: totalStock > 0,
    };

    // Cập nhật document trong MongoDB
    const updatedLaptop = await this.laptopModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (!updatedLaptop) {
      throw new BadRequestException("Không tìm thấy laptop để cập nhật");
    }

    return updatedLaptop;
  }

  // Xóa một laptop
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    // Kiểm tra laptop có tồn tại không
    const laptop = await this.laptopModel.findById(id).exec();
    if (!laptop) throw new NotFoundException("Không tìm thấy laptop");

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

    // Xóa document khỏi MongoDB
    return await this.laptopModel.findByIdAndDelete(id).exec();
  }

  async getAllBrand(): Promise<string[]> {
    const laptops = await this.laptopModel.find().exec();
    const brands = new Array<string>();
    laptops.forEach((laptop) => {
      if (laptop.brand) {
        brands.push(laptop.brand);
      }
    });
    return Array.from(brands);
  }

  async getAllLaptopByBrand(brand: string): Promise<Laptop[]> {
    const laptops = await this.laptopModel.find({ brand }).exec();
    if (!laptops || laptops.length === 0) {
      throw new NotFoundException(
        "Không tìm thấy laptop nào cho thương hiệu này"
      );
    }
    return laptops;
  }
}
