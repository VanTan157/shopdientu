import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  IsDate,
  IsObject,
} from "class-validator";
import { Transform, Type } from "class-transformer";

// DTO cho biến thể màu sắc
class ColorVariantDto {
  // Tên màu (bắt buộc, ví dụ: "Black")
  @IsString()
  @IsNotEmpty()
  color: string;

  // Đường dẫn ảnh (tùy chọn, sẽ được cập nhật sau khi upload)
  @IsString()
  @IsNotEmpty()
  image?: string;

  // Số lượng tồn kho của màu (bắt buộc, ví dụ: 20)
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

// DTO cho thông số kỹ thuật
class SpecificationsDto {
  // Loại driver (tùy chọn, ví dụ: "Dynamic")
  @IsString()
  @IsNotEmpty()
  driverType: string;

  // Kích thước driver (tùy chọn, mm)
  @IsNumber()
  @IsNotEmpty()
  driverSize: number;

  // Dải tần số (tùy chọn, Hz)
  @IsString()
  @IsNotEmpty()
  frequencyRange: string;

  // Độ nhạy (tùy chọn, dB)
  @IsNumber()
  @IsNotEmpty()
  sensitivity: number;

  // Trở kháng (tùy chọn, Ohms)
  @IsNumber()
  @IsNotEmpty()
  impedance: number;

  // Công nghệ chống ồn (tùy chọn)
  @IsString()
  @IsNotEmpty()
  noiseCancellation: string;

  // Thời lượng pin (tùy chọn, giờ)
  @IsNumber()
  @IsNotEmpty()
  batteryLife: number;

  // Thời gian sạc (tùy chọn, giờ)
  @IsNumber()
  @IsNotEmpty()
  chargingTime: number;

  // Loại cổng sạc (tùy chọn)
  @IsString()
  @IsNotEmpty()
  chargingPort: string;

  // Loại micro (tùy chọn)
  @IsString()
  @IsNotEmpty()
  microphone: string;

  // Chất lượng âm thanh (tùy chọn)
  @IsString()
  @IsNotEmpty()
  audioQuality: string;
}

// DTO cho kích thước
class DimensionsDto {
  // Chiều dài (tùy chọn, cm)
  @IsNumber()
  @IsNotEmpty()
  length: number;

  // Chiều rộng (tùy chọn, cm)
  @IsNumber()
  @IsNotEmpty()
  width: number;

  // Chiều cao (tùy chọn, cm)
  @IsNumber()
  @IsNotEmpty()
  height: number;
}

// DTO để tạo Headphone
export class CreateHeadphoneDto {
  // Tên tai nghe (bắt buộc)
  @IsString()
  @IsNotEmpty()
  name: string;

  // Hãng sản xuất (bắt buộc)
  @IsString()
  @IsNotEmpty()
  brand: string;

  // Loại tai nghe (bắt buộc)
  @IsString()
  @IsNotEmpty()
  type: string;

  // Mô tả sản phẩm (tùy chọn)
  @IsString()
  @IsNotEmpty()
  description: string;

  // Giá khởi điểm (bắt buộc, VNĐ)
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  startingPrice: number;

  // Phần trăm khuyến mãi (bắt buộc)
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  promotion: number;

  // Trạng thái khuyến mãi
  @IsBoolean()
  @IsOptional()
  isPromotion: boolean;

  // Giá cuối cùng
  @IsNumber()
  @IsOptional()
  finalPrice: number;

  // Thông số kỹ thuật (tùy chọn)
  @IsNotEmpty()
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
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  @Type(() => ColorVariantDto)
  colorVariants: ColorVariantDto[];

  // Tổng số lượng tồn kho
  @IsNumber()
  @IsOptional()
  totalStock: number;

  // Trạng thái sẵn có
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  // Trọng lượng (tùy chọn, gram)
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  weight: number;

  // Kích thước (tùy chọn)
  @IsNotEmpty()
  @ValidateNested()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  // Thời gian bảo hành (tùy chọn)
  @IsString()
  @IsNotEmpty()
  warranty: string;

  // Ngày phát hành (tùy chọn)
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  releaseDate: Date;

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

  // Đường dẫn SEO (bắt buộc)
  @IsString()
  @IsNotEmpty()
  slug: string;

  // Mã hàng hóa (bắt buộc)
  @IsString()
  @IsNotEmpty()
  sku: string;
}
