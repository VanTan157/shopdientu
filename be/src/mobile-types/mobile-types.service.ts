import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateMobileTypeDto } from "./dto/create-mobile-type.dto";
import { MobileType } from "./entities/mobile-type.entity";

@Injectable()
export class MobileTypesService {
  // Thay ProductTypesService
  constructor(
    @InjectModel(MobileType.name) private mobileTypeModel: Model<MobileType>
  ) {}

  async create(createMobileTypeDto: CreateMobileTypeDto): Promise<MobileType> {
    const newMobileType = new this.mobileTypeModel(createMobileTypeDto);
    return newMobileType.save();
  }

  async findAll(): Promise<MobileType[]> {
    // Thay ProductType[]
    return this.mobileTypeModel.find().exec();
  }

  async findOne(id: string): Promise<MobileType> {
    // Thay ProductType
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel.findById({ _id: id }).exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy Mobile Type");
    }
    return mobileType;
  }

  async update(id: string, type: string): Promise<MobileType> {
    // Thay ProductType
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel
      .findByIdAndUpdate({ _id: id }, { type }, { new: true })
      .exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy MobileType");
    }
    return mobileType;
  }

  async remove(id: string): Promise<MobileType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }
    const mobileType = await this.mobileTypeModel
      .findByIdAndDelete({ _id: id })
      .exec();
    if (!mobileType) {
      throw new Error("Không tìm thấy Mobile");
    }
    return mobileType;
  }
}
