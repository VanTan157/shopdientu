// order/dto/create-order.dto.ts
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";
import { EOrderStatus } from "src/common/types/order.types";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @IsString({ each: true })
  orderitemIds: string[];

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  status?: EOrderStatus;
}
