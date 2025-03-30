import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MobileTypesService } from "src/mobile-types/mobile-types.service";
import { Mobile } from "./entities/mobiles.entity";
import { CreateMobileDto } from "./dto/create-mobiles.dto";
import { UpdateMobileDto } from "./dto/update-mobiles.dto";
import * as fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class MobilesService {
  constructor(
    @InjectModel(Mobile.name) private mobileModel: Model<Mobile>,
    private mobileTypesService: MobileTypesService
  ) {}

  async create(
    createMobileDto: CreateMobileDto,
    files: Express.Multer.File[]
  ): Promise<Mobile> {
    const mobileType = await this.mobileTypesService.findOne(
      createMobileDto.mobile_type_id
    );
    if (!mobileType) throw new NotFoundException("Mobile type không tồn tại");

    const promotion = createMobileDto.promotion ?? 0;
    const IsPromotion = promotion > 0;
    const finalPrice =
      createMobileDto.StartingPrice -
      (promotion * createMobileDto.StartingPrice) / 100;

    // Tạo colorVariants từ DTO và files
    const colorVariants = createMobileDto.colorVariants.map(
      (variant, index) => {
        if (!files[index]) {
          throw new NotFoundException(`Thiếu ảnh cho màu ${variant.color}`);
        }
        return {
          color: variant.color,
          image: `/image/${files[index].filename}`,
          stock: variant.stock ?? 0,
        };
      }
    );

    const mobileData = {
      ...createMobileDto,
      finalPrice,
      promotion,
      IsPromotion,
      colorVariants,
      isAvailable: colorVariants.some((variant) => variant.stock > 0),
    };

    const newMobile = new this.mobileModel(mobileData);

    try {
      return await newMobile.save();
    } catch (error) {
      // Kiểm tra xem ảnh đã được sử dụng bởi sản phẩm khác chưa trước khi xóa
      const imagePaths = colorVariants.map((variant) => variant.image);
      const imagesInUse = await this.mobileModel
        .find({ "colorVariants.image": { $in: imagePaths } })
        .exec();

      const imagesInUseSet = new Set(
        imagesInUse.flatMap((m) => m.colorVariants.map((v) => v.image))
      );
      const imagesToDelete = imagePaths.filter(
        (image) => !imagesInUseSet.has(image)
      );

      // Chỉ xóa những ảnh không được sử dụng bởi sản phẩm khác
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((imagePath) =>
            unlinkAsync(`.${imagePath}`).catch((err) =>
              console.error("Không thể xóa file:", err)
            )
          )
        );
      }

      throw error; // Ném lại lỗi để client xử lý
    }
  }

  async findAll(): Promise<Mobile[]> {
    return this.mobileModel.find().populate("mobile_type_id").exec();
  }

  async findOne(id: string): Promise<Mobile> {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");
    const mobile = await this.mobileModel
      .findById(id)
      .populate("mobile_type_id")
      .exec();
    if (!mobile) throw new NotFoundException("Mobile không tồn tại");
    return mobile;
  }

  async update(
    id: string,
    updateMobileDto: UpdateMobileDto,
    files?: Express.Multer.File[]
  ) {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");

    const mobile = await this.mobileModel.findById(id).exec();
    if (!mobile) throw new NotFoundException("Không tìm thấy Mobile");

    const startingPrice = updateMobileDto.StartingPrice ?? mobile.StartingPrice;
    const promotion = updateMobileDto.promotion ?? mobile.promotion;
    const finalPrice = startingPrice - (promotion * startingPrice) / 100;

    let colorVariants = mobile.colorVariants;

    // Xử lý colorVariants khi có cập nhật
    if (updateMobileDto.colorVariants) {
      const newColorVariants = updateMobileDto.colorVariants;

      // Xác định các ảnh cũ có thể cần xóa
      const oldImagesToCheck = mobile.colorVariants
        .filter((oldVariant) =>
          newColorVariants.some(
            (newVariant, idx) =>
              newVariant.color === oldVariant.color && files?.[idx] // Có file mới cho màu này
          )
        )
        .map((variant) => variant.image);

      // Kiểm tra xem ảnh cũ có được sử dụng bởi sản phẩm khác không
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
      colorVariants = newColorVariants.map((variant, index) => {
        const existingVariant = mobile.colorVariants.find(
          (v) => v.color === variant.color
        );
        return {
          color: variant.color,
          image: files?.[index]
            ? `/image/${files[index].filename}` // Ảnh mới từ file upload
            : existingVariant?.image || "", // Giữ ảnh cũ nếu không có file mới
          stock: variant.stock ?? existingVariant?.stock ?? 0,
        };
      });
    }

    // Cập nhật bản ghi trong database
    const updatedMobile = await this.mobileModel
      .findByIdAndUpdate(
        id,
        {
          ...updateMobileDto,
          finalPrice,
          IsPromotion: promotion > 0,
          StartingPrice: startingPrice,
          promotion,
          colorVariants,
          isAvailable: colorVariants.some((variant) => variant.stock > 0),
        },
        { new: true }
      )
      .exec();

    return updatedMobile;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("ID không hợp lệ");

    const mobile = await this.mobileModel.findById(id).exec();
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
    return this.mobileModel.findByIdAndDelete(id).exec();
  }

  async findByMobileType(mobileTypeId: string): Promise<Mobile[]> {
    if (!Types.ObjectId.isValid(mobileTypeId))
      throw new NotFoundException("Mobile type ID không hợp lệ");
    const mobileType = await this.mobileTypesService.findOne(mobileTypeId);
    if (!mobileType) throw new NotFoundException("Mobile type không tồn tại");
    return this.mobileModel
      .find({ mobile_type_id: mobileTypeId })
      .populate("mobile_type_id")
      .exec();
  }
}
