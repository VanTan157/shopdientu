import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CreateMobileDto } from "./dto/create-mobiles.dto";
import { UpdateMobileDto } from "./dto/update-mobiles.dto";
import { Mobile } from "./entities/mobiles.entity";
import { MobilesService } from "./mobiles.service";
import { EUserType } from "src/common/types/user.types";
import { ApiResponse } from "src/common/types/api";

@Controller("mobiles")
export class MobilesController {
  constructor(private readonly mobilesService: MobilesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
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
          cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif,webp)"), false);
      },
    })
  )
  async create(
    @Body() createMobileDto: CreateMobileDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Mobile>> {
    return this.mobilesService.create(createMobileDto, files);
  }

  @Get()
  findAll(): Promise<ApiResponse<Mobile[]>> {
    return this.mobilesService.findAll();
  }

  @Get("get-all-brand")
  getAllBranch(): Promise<ApiResponse<string[]>> {
    return this.mobilesService.getAllBrand();
  }

  @Get("get-all-mobile-by-brand/:brand")
  getAllMobileByBrand(
    @Param("brand") brand: string
  ): Promise<ApiResponse<Mobile[]>> {
    return this.mobilesService.getAllMobileByBrand(brand);
  }

  @Get("get-by-promotion")
  getByPromotion(): Promise<ApiResponse<Mobile[]>> {
    return this.mobilesService.findByPromotion();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ApiResponse<Mobile>> {
    return this.mobilesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
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
          cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif,webp)"), false);
      },
    })
  )
  update(
    @Param("id") id: string,
    @Body() updateMobileDto: UpdateMobileDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<ApiResponse<Mobile>> {
    return this.mobilesService.update(id, updateMobileDto, files);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    return this.mobilesService.remove(id);
  }

  @Get("type/:branch")
  async findByBranch(
    @Param("branch") branch: string
  ): Promise<ApiResponse<Mobile[]>> {
    return this.mobilesService.getAllMobileByBrand(branch);
  }
}
