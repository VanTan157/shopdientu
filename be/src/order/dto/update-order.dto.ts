import { IsOptional, IsString } from "class-validator";
import { EOrderStatus } from "src/common/types/order.types";

export class UpdateOrderDto {
  @IsString()
  status: EOrderStatus;
}
