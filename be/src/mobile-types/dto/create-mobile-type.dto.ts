import { IsString, IsNotEmpty } from "class-validator";

export class CreateMobileTypeDto {
  // Thay CreateProductTypeDto
  @IsString()
  @IsNotEmpty()
  type: string;
}
