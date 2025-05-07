import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsObject,
  IsEnum,
} from "class-validator";
import { ProductType } from "../entities/order-item.entity";

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsEnum(ProductType)
  product_type: ProductType;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Chuyển chuỗi thành số nguyên
  @IsNumber({}, { message: "quantity must be a number" })
  @Min(1, { message: "quantity must be at least 1" })
  quantity: number;

  @IsObject()
  colorVariant: { _id: string; color: string; image: string };
}
