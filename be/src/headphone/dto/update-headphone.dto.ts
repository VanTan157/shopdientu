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
  // Tên màu (tùy chọn, ví dụ: "Black")
  @IsString()
  @IsOptional()
  color: string;

  // Đường dẫn ảnh (tùy chọn, sẽ được cập nhật sau khi upload)
  @IsString()
  @IsOptional()
  image?: string;

  // Số lượng tồn kho của màu (tùy chọn, ví dụ: 20)
  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  hasNewImage?: string;
}

// DTO cho thông số kỹ thuật
class SpecificationsDto {
  // Loại driver (tùy chọn, ví dụ: "Dynamic")
  @IsString()
  @IsOptional()
  driverType?: string;

  // Kích thước driver (tùy chọn, mm)
  @IsNumber()
  @IsOptional()
  driverSize?: number;

  // Dải tần số (tùy chọn, Hz)
  @IsString()
  @IsOptional()
  frequencyRange?: string;

  // Độ nhạy (tùy chọn, dB)
  @IsNumber()
  @IsOptional()
  sensitivity?: number;

  // Trở kháng (tùy chọn, Ohms)
  @IsNumber()
  @IsOptional()
  impedance?: number;

  // Công nghệ chống ồn (tùy chọn)
  @IsString()
  @IsOptional()
  noiseCancellation?: string;

  // Thời lượng pin (tùy chọn, giờ)
  @IsNumber()
  @IsOptional()
  batteryLife?: number;

  // Thời gian sạc (tùy chọn, giờ)
  @IsNumber()
  @IsOptional()
  chargingTime?: number;

  // Loại cổng sạc (tùy chọn)
  @IsString()
  @IsOptional()
  chargingPort?: string;

  // Loại micro (tùy chọn)
  @IsString()
  @IsOptional()
  microphone?: string;

  // Chất lượng âm thanh (tùy chọn)
  @IsString()
  @IsOptional()
  audioQuality?: string;
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

// DTO để cập nhật Headphone
export class UpdateHeadphoneDto {
  // Tên tai nghe (tùy chọn)
  @IsString()
  @IsOptional()
  name?: string;

  // Hãng sản xuất (tùy chọn)
  @IsString()
  @IsOptional()
  brand?: string;

  // Loại tai nghe (tùy chọn)
  @IsString()
  @IsOptional()
  type?: string;

  // Mô tả sản phẩm (tùy chọn)
  @IsString()
  @IsOptional()
  description?: string;

  // Giá khởi điểm (tùy chọn, VNĐ)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  startingPrice?: number;

  // Phần trăm khuyến mãi (tùy chọn)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  promotion?: number;

  // Trạng thái khuyến mãi
  @IsBoolean()
  @IsOptional()
  isPromotion?: boolean;

  // Giá cuối cùng
  @IsNumber()
  @IsOptional()
  finalPrice?: number;

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
  colorVariants?: ColorVariantDto[];

  // Tổng số lượng tồn kho
  @IsNumber()
  @IsOptional()
  totalStock?: number;

  // Trạng thái sẵn có
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  // Trọng lượng (tùy chọn, gram)
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

  // Kết nối (tùy chọn)
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

  // Đường dẫn SEO (tùy chọn)
  @IsString()
  @IsOptional()
  slug?: string;

  // Mã hàng hóa (tùy chọn)
  @IsString()
  @IsOptional()
  sku?: string;
}
