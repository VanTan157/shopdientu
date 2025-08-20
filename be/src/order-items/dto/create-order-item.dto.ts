import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
  IsOptional,
  Min,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { EProductType } from "src/common/types/order.types";

class ColorVariantDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  color: string;

  @IsString()
  image: string;
}

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsEnum(EProductType)
  productType: EProductType;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ColorVariantDto)
  colorVariant: ColorVariantDto;
}
