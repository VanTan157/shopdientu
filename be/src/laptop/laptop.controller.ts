import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LaptopService } from "./laptop.service";
import { CreateLaptopDto } from "./dto/create-laptop.dto";
import { UpdateLaptopDto } from "./dto/update-laptop.dto";
import { Laptop } from "./entities/laptop.entity";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { EUserType } from "src/common/types/user.types";
import { ApiResponse } from "src/common/types/api";

// Controller xử lý các request HTTP cho module Laptop
@Controller("laptops")
export class LaptopController {
  constructor(private readonly laptopService: LaptopService) {}

  // Endpoint tạo laptop mới
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./image", // Thư mục lưu trữ ảnh
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else
          cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)"), false);
      },
    })
  )
  create(
    // Dữ liệu DTO từ body request
    @Body() createLaptopDto: CreateLaptopDto,
    // Danh sách file ảnh được upload
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Laptop>> {
    return this.laptopService.create(createLaptopDto, files);
  }

  // Endpoint lấy danh sách tất cả laptop
  @Get()
  findAll(): Promise<ApiResponse<Laptop[]>> {
    return this.laptopService.findAll();
  }

  @Get("get-all-brand")
  getAllBranch(): Promise<ApiResponse<string[]>> {
    return this.laptopService.getAllBrand();
  }

  @Get("get-all-laptop-by-brand/:brand")
  getAllLaptopByBrand(
    @Param("brand") brand: string
  ): Promise<ApiResponse<Laptop[]>> {
    return this.laptopService.getAllLaptopByBrand(brand);
  }

  @Get("get-by-promotion")
  getByPromotion(): Promise<ApiResponse<Laptop[]>> {
    return this.laptopService.findByPromotion();
  }

  // Endpoint lấy thông tin một laptop theo ID
  @Get(":id")
  findOne(@Param("id") id: string): Promise<ApiResponse<Laptop>> {
    return this.laptopService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Patch(":id")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./image",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else
          cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)"), false);
      },
    })
  )
  update(
    @Param("id") id: string,
    @Body() updateLaptopDto: UpdateLaptopDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Laptop>> {
    return this.laptopService.update(id, updateLaptopDto, files);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    return this.laptopService.remove(id);
  }
}
