import { PartialType } from "@nestjs/swagger";
import { CreateMobileTypeDto } from "./create-mobile-type.dto";

export class UpdateMobileTypeDto extends PartialType(CreateMobileTypeDto) {}
