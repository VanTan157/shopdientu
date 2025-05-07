import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Schema định nghĩa cấu trúc cho collection Laptop trong MongoDB
@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Laptop extends Document {
  // Tên của laptop (ví dụ: "Dell XPS 13")
  @Prop({ required: true })
  name: string;

  // Hãng sản xuất của laptop (ví dụ: "Dell", "HP", "Apple")
  @Prop({ required: true })
  brand: string;

  // Danh mục laptop (ví dụ: "Ultrabook", "Gaming", "Workstation")
  @Prop({ required: true })
  category: string;

  // Mô tả chi tiết về laptop (văn bản hoặc HTML)
  @Prop()
  description: string;

  // Giá khởi điểm của laptop (giá gốc trước khuyến mãi, đơn vị: VNĐ)
  @Prop({ required: true })
  startingPrice: number;

  // Phần trăm khuyến mãi (ví dụ: 10 = 10%)
  @Prop({ required: true, default: 0 })
  promotion: number;

  // Trạng thái có áp dụng khuyến mãi hay không
  @Prop({ required: true, default: false })
  isPromotion: boolean;

  // Giá cuối cùng sau khi áp dụng khuyến mãi
  @Prop({ required: true })
  finalPrice: number;

  // Thông số kỹ thuật của laptop
  @Prop({ type: Object })
  specifications: {
    // Kích thước màn hình (inch, ví dụ: 13.4)
    screenSize?: number;
    // Độ phân giải màn hình (ví dụ: "1920x1200")
    resolution?: string;
    // Bộ vi xử lý (ví dụ: "Intel Core i7-1165G7")
    cpu?: string;
    // Card đồ họa (ví dụ: "Intel Iris Xe")
    gpu?: string;
    // Dung lượng RAM (GB, ví dụ: 16)
    ram?: number;
    // Dung lượng lưu trữ (GB, ví dụ: 512)
    storage?: number;
    // Dung lượng pin (Wh, ví dụ: 52)
    battery?: number;
    // Hệ điều hành (ví dụ: "Windows 11")
    os?: string;
    // Tần số quét màn hình (Hz, ví dụ: "60Hz")
    refreshRate?: string;
    // Loại bàn phím (ví dụ: "Backlit", "RGB")
    keyboard?: string;
    // Danh sách cổng kết nối (ví dụ: ["USB-C", "HDMI"])
    ports?: string[];
    // Thông tin webcam (ví dụ: "720p")
    webcam?: string;
    // Thông tin âm thanh (ví dụ: "Dolby Atmos")
    audio?: string;
  };

  // Danh sách biến thể màu sắc
  @Prop({
    type: [
      {
        // Tên màu (ví dụ: "Silver")
        color: { type: String, required: true },
        // Đường dẫn đến ảnh của màu (ví dụ: "/image/silver.jpg")
        image: { type: String, required: true },
        // Số lượng tồn kho của màu này
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    default: [],
  })
  colorVariants: { color: string; image: string; stock: number }[];

  // Tổng số lượng tồn kho (tính từ colorVariants)
  @Prop({ required: true, default: 0 })
  totalStock: number;

  // Trạng thái sẵn có của sản phẩm (true: có hàng, false: hết hàng)
  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  // Trọng lượng của laptop (kg, ví dụ: 1.2)
  @Prop({ type: Number })
  weight: number;

  // Kích thước laptop (dài x rộng x cao, cm)
  @Prop({ type: Object })
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };

  // Thời gian bảo hành (ví dụ: "12 tháng")
  @Prop()
  warranty: string;

  // Ngày phát hành sản phẩm
  @Prop()
  releaseDate: Date;

  // Danh sách thẻ liên quan (ví dụ: ["Ultrabook", "Lightweight"])
  @Prop({ type: [String], default: [] })
  tags: string[];

  // Kết nối không dây (ví dụ: ["Wi-Fi 6", "Bluetooth 5.0"])
  @Prop({ type: [String], default: [] })
  connectivity: string[];

  // Phụ kiện đi kèm (ví dụ: ["Charger", "Case"])
  @Prop({ type: [String], default: [] })
  accessories: string[];

  // Đường dẫn SEO-friendly (ví dụ: "dell-xps-13-9310")
  @Prop({ required: true })
  slug: string;

  // Mã hàng hóa để quản lý kho (ví dụ: "XPS13-9310")
  @Prop({ required: true })
  sku: string;
}

// Tạo schema từ class Laptop
export const LaptopSchema = SchemaFactory.createForClass(Laptop);
