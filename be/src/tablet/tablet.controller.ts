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
import { TabletService } from "./tablet.service";
import { CreateTabletDto } from "./dto/create-tablet.dto";
import { Tablet } from "./entities/tablet.entity";
import { UpdateTabletDto } from "./dto/update-tablet.dto";
import { EUserType } from "src/common/types/user.types";
import { ApiResponse } from "src/common/types/api";

@Controller("tablets")
export class TabletController {
  constructor(private readonly tabletService: TabletService) {}

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
    @Body() createTabletDto: CreateTabletDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Tablet>> {
    return this.tabletService.create(createTabletDto, files);
  }

  @Get()
  findAll(): Promise<ApiResponse<Tablet[]>> {
    return this.tabletService.findAll();
  }

  @Get("get-by-promotion")
  getByPromotion(): Promise<ApiResponse<Tablet[]>> {
    return this.tabletService.findByPromotion();
  }

  @Get("get-all-brand")
  getAllBranch(): Promise<ApiResponse<string[]>> {
    return this.tabletService.getAllBrand();
  }

  @Get("get-all-tablet-by-brand/:brand")
  getAllTabletByBrand(
    @Param("brand") brand: string
  ): Promise<ApiResponse<Tablet[]>> {
    return this.tabletService.getAllTabletByBrand(brand);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ApiResponse<Tablet>> {
    return this.tabletService.findOne(id);
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
    @Body() updateTabletDto: UpdateTabletDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ApiResponse<Tablet>> {
    return this.tabletService.update(id, updateTabletDto, files);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    return this.tabletService.remove(id);
  }
}
