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
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { HeadphoneService } from "./headphone.service";
import { CreateHeadphoneDto } from "./dto/create-headphone.dto";
import { Headphone } from "./entities/headphone.entity";
import { UpdateHeadphoneDto } from "./dto/update-headphone.dto";
import { EUserType } from "src/common/types/user.types";
import { ApiResponse } from "src/common/types/api";

@Controller("headphones")
export class HeadphoneController {
  constructor(private readonly headphoneService: HeadphoneService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Post()
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
  create(
    @Body() createheadphoneDto: CreateHeadphoneDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Headphone>> {
    return this.headphoneService.create(createheadphoneDto, files);
  }

  // Endpoint lấy danh sách tất cả headphone
  @Get()
  findAll(): Promise<ApiResponse<Headphone[]>> {
    return this.headphoneService.findAll();
  }

  @Get("get-all-brand")
  getAllBranch(): Promise<ApiResponse<string[]>> {
    return this.headphoneService.getAllBrand();
  }

  @Get("get-by-promotion")
  getByPromotion(): Promise<ApiResponse<Headphone[]>> {
    return this.headphoneService.findByPromotion();
  }

  @Get("get-all-headphone-by-brand/:brand")
  getAllheadphoneByBrand(
    @Param("brand") brand: string
  ): Promise<ApiResponse<Headphone[]>> {
    return this.headphoneService.getAllheadphoneByBrand(brand);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ApiResponse<Headphone>> {
    return this.headphoneService.findOne(id);
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
    @Body() updateheadphoneDto: UpdateHeadphoneDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Headphone>> {
    return this.headphoneService.update(id, updateheadphoneDto, files);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    return this.headphoneService.remove(id);
  }
}
