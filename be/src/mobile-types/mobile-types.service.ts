import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateMobileTypeDto } from "./dto/create-mobile-type.dto"; // Thay CreateProductTypeDto
import { MobileType } from "./entities/mobile-type.entity"; // Thay ProductType

@Injectable()
export class MobileTypesService {
  // Thay ProductTypesService
  constructor(
    @InjectModel(MobileType.name) private mobileTypeModel: Model<MobileType> // Thay productTypeModel & ProductType
  ) {}

  async create(
    createMobileTypeDto: CreateMobileTypeDto // Thay CreateProductTypeDto
  ): Promise<MobileType> {
    // Thay ProductType
    const newMobileType = new this.mobileTypeModel(createMobileTypeDto); // Thay productTypeModel
    return newMobileType.save();
  }

  async findAll(): Promise<MobileType[]> {
    // Thay ProductType[]
    return this.mobileTypeModel.find().exec(); // Thay productTypeModel
  }

  async findOne(id: string): Promise<MobileType> {
    // Thay ProductType
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel // Thay productTypeModel
      .findById({ _id: id })
      .exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy Mobile Type"); // Thay Product Type
    }
    return mobileType;
  }

  async update(id: string, type: string): Promise<MobileType> {
    // Thay ProductType
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel // Thay productTypeModel
      .findByIdAndUpdate({ _id: id }, { type }, { new: true })
      .exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy MobileType"); // Thay ProductType
    }
    return mobileType;
  }

  async remove(id: string): Promise<MobileType> {
    // Thay ProductType
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel // Thay productTypeModel
      .findByIdAndDelete({ _id: id })
      .exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy Mobile"); // Thay Product
    }
    return mobileType;
  }
}
