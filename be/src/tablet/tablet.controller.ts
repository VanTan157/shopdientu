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

// Controller xử lý các request HTTP cho module Laptop
@Controller("tablets")
export class TabletController {
  constructor(private readonly tabletService: TabletService) {}

  // Endpoint tạo laptop mới
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("ADMIN")
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
    @Body() createTabletDto: CreateTabletDto,
    // Danh sách file ảnh được upload
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Tablet> {
    return this.tabletService.create(createTabletDto, files);
  }

  // Endpoint lấy danh sách tất cả laptop
  @Get()
  findAll(): Promise<Tablet[]> {
    return this.tabletService.findAll();
  }

  @Get("get-by-promotion")
  getByPromotion() {
    return this.tabletService.findByPromotion();
  }

  @Get("get-all-brand")
  getAllBranch() {
    return this.tabletService.getAllBrand();
  }

  @Get("get-all-tablet-by-brand/:brand")
  getAllLaptopByBrand(@Param("brand") brand: string) {
    return this.tabletService.getAllTabletByBrand(brand);
  }

  // Endpoint lấy thông tin một laptop theo ID
  @Get(":id")
  findOne(@Param("id") id: string): Promise<Tablet> {
    return this.tabletService.findOne(id);
  }

  // Endpoint cập nhật laptop
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("ADMIN")
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
    // ID của laptop từ URL
    @Param("id") id: string,
    // Dữ liệu DTO từ body request
    @Body() updateTabletDto: UpdateTabletDto,
    // Danh sách file ảnh mới (nếu có)
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Tablet> {
    return this.tabletService.update(id, updateTabletDto, files);
  }

  // Endpoint xóa laptop
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tabletService.remove(id);
  }
}
