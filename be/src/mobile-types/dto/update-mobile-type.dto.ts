import { PartialType } from "@nestjs/swagger";
import { CreateMobileTypeDto } from "./create-mobile-type.dto"; // Thay CreateProductTypeDto

export class UpdateMobileTypeDto extends PartialType(CreateMobileTypeDto) {} // Thay UpdateProductTypeDto
