import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { MobileTypesService } from "./mobile-types.service"; // Thay ProductTypesService
import { CreateMobileTypeDto } from "./dto/create-mobile-type.dto"; // Thay CreateProductTypeDto
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("mobile-types") // Thay product-types
export class MobileTypesController {
  // Thay ProductTypesController
  constructor(private readonly mobileTypesService: MobileTypesService) {} // Thay productTypesService

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() createMobileTypeDto: CreateMobileTypeDto) {
    // Thay CreateProductTypeDto
    return this.mobileTypesService.create(createMobileTypeDto); // Thay productTypesService
  }

  @Get()
  findAll() {
    return this.mobileTypesService.findAll(); // Thay productTypesService
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.mobileTypesService.findOne(id); // Thay productTypesService
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body("type") type: string) {
    return this.mobileTypesService.update(id, type); // Thay productTypesService
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.mobileTypesService.remove(id); // Thay productTypesService
  }
}
