// order/dto/create-order.dto.ts
import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  orderitem_ids: string[];

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  status?: string; // Tùy chọn, sẽ dùng default nếu không cung cấp
}
