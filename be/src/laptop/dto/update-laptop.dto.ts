import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsDate,
  IsObject,
} from "class-validator";
import { Transform, Type } from "class-transformer";

// DTO cho biến thể màu sắc
class ColorVariantDto {
  // Tên màu (bắt buộc, ví dụ: "Silver")
  @IsString()
  @IsOptional()
  color: string;

  // Đường dẫn ảnh (tùy chọn, sẽ được cập nhật sau khi upload)
  @IsString()
  @IsOptional()
  image?: string;

  // Số lượng tồn kho của màu (bắt buộc, ví dụ: 20)
  @IsNumber()
  @IsOptional()
  stock: number;

  @IsString()
  @IsOptional()
  hasNewImage?: string;
}

// DTO cho thông số kỹ thuật
class SpecificationsDto {
  // Kích thước màn hình (tùy chọn, inch)
  @IsNumber()
  @IsOptional()
  screenSize?: number;

  // Độ phân giải màn hình (tùy chọn)
  @IsString()
  @IsOptional()
  resolution?: string;

  // Bộ vi xử lý (tùy chọn)
  @IsString()
  @IsOptional()
  cpu?: string;

  // Card đồ họa (tùy chọn)
  @IsString()
  @IsOptional()
  gpu?: string;

  // Dung lượng RAM (tùy chọn, GB)
  @IsNumber()
  @IsOptional()
  ram?: number;

  // Dung lượng lưu trữ (tùy chọn, GB)
  @IsNumber()
  @IsOptional()
  storage?: number;

  // Dung lượng pin (tùy chọn, Wh)
  @IsNumber()
  @IsOptional()
  battery?: number;

  // Hệ điều hành (tùy chọn)
  @IsString()
  @IsOptional()
  os?: string;

  // Tần số quét màn hình (tùy chọn, Hz)
  @IsString()
  @IsOptional()
  refreshRate?: string;

  // Loại bàn phím (tùy chọn)
  @IsString()
  @IsOptional()
  keyboard?: string;

  // Danh sách cổng kết nối (tùy chọn)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ports?: string[];

  // Thông tin webcam (tùy chọn)
  @IsString()
  @IsOptional()
  webcam?: string;

  // Thông tin âm thanh (tùy chọn)
  @IsString()
  @IsOptional()
  audio?: string;
}

// DTO cho kích thước
class DimensionsDto {
  // Chiều dài (tùy chọn, cm)
  @IsNumber()
  @IsOptional()
  length?: number;

  // Chiều rộng (tùy chọn, cm)
  @IsNumber()
  @IsOptional()
  width?: number;

  // Chiều cao (tùy chọn, cm)
  @IsNumber()
  @IsOptional()
  height?: number;
}

// DTO để tạo Laptop
export class UpdateLaptopDto {
  // Tên laptop (bắt buộc)
  @IsString()
  @IsOptional()
  name: string;

  // Hãng sản xuất (bắt buộc)
  @IsString()
  @IsOptional()
  brand: string;

  // Danh mục laptop (bắt buộc)
  @IsString()
  @IsOptional()
  category: string;

  // Mô tả sản phẩm (tùy chọn)
  @IsString()
  @IsOptional()
  description?: string;

  // Giá khởi điểm (bắt buộc, VNĐ)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  startingPrice: number;

  // Phần trăm khuyến mãi (bắt buộc)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  promotion: number;

  // Trạng thái khuyến mãi
  @IsBoolean()
  @IsOptional()
  isPromotion: boolean;

  // Giá cuối cùng
  @IsBoolean()
  @IsOptional()
  finalPrice: number;

  // Thông số kỹ thuật (tùy chọn)
  @IsOptional()
  @ValidateNested()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  @Type(() => SpecificationsDto)
  specifications?: SpecificationsDto;

  // Danh sách biến thể màu
  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  @Type(() => ColorVariantDto)
  colorVariants: ColorVariantDto[];

  // Tổng số lượng tồn kho
  @IsBoolean()
  @IsOptional()
  totalStock: number;

  // Trạng thái sẵn có (bắt buộc)
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  // Trọng lượng (tùy chọn, kg)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  weight?: number;

  // Kích thước (tùy chọn)
  @IsOptional()
  @IsObject()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  // Thời gian bảo hành (tùy chọn)
  @IsString()
  @IsOptional()
  warranty?: string;

  // Ngày phát hành (tùy chọn)
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releaseDate?: Date;

  // Danh sách thẻ (tùy chọn)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  tags?: string[];

  // Kết nối không dây (tùy chọn)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  connectivity?: string[];

  // Phụ kiện đi kèm (tùy chọn)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  accessories?: string[];

  // Đường dẫn SEO (bắt buộc)
  @IsString()
  @IsOptional()
  slug: string;

  // Mã hàng hóa (bắt buộc)
  @IsString()
  @IsOptional()
  sku: string;
}
