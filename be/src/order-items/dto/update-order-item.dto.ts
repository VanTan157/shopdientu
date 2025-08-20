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

class UpdateColorVariantDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  color: string;

  @IsString()
  image: string;
}

export class UpdateOrderItemDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  productId: Types.ObjectId;

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

  @IsBoolean()
  isInCart: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateColorVariantDto)
  colorVariant: UpdateColorVariantDto;
}
