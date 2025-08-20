// order/dto/create-order.dto.ts
import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";
import { EOrderStatus } from "src/common/types/order.types";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
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
