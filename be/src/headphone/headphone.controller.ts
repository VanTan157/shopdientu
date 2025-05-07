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

// Controller xử lý các request HTTP cho module headphone
@Controller("headphones")
export class HeadphoneController {
  constructor(private readonly headphoneService: HeadphoneService) {}

  // Endpoint tạo headphone mới
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
    @Body() createheadphoneDto: CreateHeadphoneDto,
    // Danh sách file ảnh được upload
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Headphone> {
    return this.headphoneService.create(createheadphoneDto, files);
  }

  // Endpoint lấy danh sách tất cả headphone
  @Get()
  findAll(): Promise<Headphone[]> {
    return this.headphoneService.findAll();
  }

  @Get("get-all-brand")
  getAllBranch() {
    return this.headphoneService.getAllBrand();
  }

  @Get("get-all-headphone-by-brand/:brand")
  getAllheadphoneByBrand(@Param("brand") brand: string) {
    return this.headphoneService.getAllheadphoneByBrand(brand);
  }

  // Endpoint lấy thông tin một headphone theo ID
  @Get(":id")
  findOne(@Param("id") id: string): Promise<Headphone> {
    return this.headphoneService.findOne(id);
  }

  // Endpoint cập nhật headphone
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
    // ID của headphone từ URL
    @Param("id") id: string,
    // Dữ liệu DTO từ body request
    @Body() updateheadphoneDto: UpdateHeadphoneDto,
    // Danh sách file ảnh mới (nếu có)
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Headphone> {
    return this.headphoneService.update(id, updateheadphoneDto, files);
  }

  // Endpoint xóa headphone
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.headphoneService.remove(id);
  }
}
