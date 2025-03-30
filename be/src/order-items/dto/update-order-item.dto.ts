import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  mobile_id: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Chuyển chuỗi thành số nguyên
  @IsNumber({}, { message: "quantity must be a number" })
  @Min(1, { message: "quantity must be at least 1" })
  quantity: number;
}
