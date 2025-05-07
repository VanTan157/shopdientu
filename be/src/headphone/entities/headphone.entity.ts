import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Schema định nghĩa cấu trúc cho collection Headphone trong MongoDB
@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Headphone extends Document {
  // Tên của tai nghe (ví dụ: "Sony WH-1000XM5")
  @Prop({ required: true })
  name: string;

  // Hãng sản xuất của tai nghe (ví dụ: "Sony", "Bose", "Apple")
  @Prop({ required: true })
  brand: string;

  // Loại tai nghe (ví dụ: "Over-ear", "In-ear", "On-ear")
  @Prop({ required: true })
  type: string;

  // Mô tả chi tiết về tai nghe (văn bản hoặc HTML)
  @Prop()
  description: string;

  // Giá khởi điểm của tai nghe (giá gốc trước khuyến mãi, đơn vị: VNĐ)
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

  // Thông số kỹ thuật của tai nghe
  @Prop({ type: Object })
  specifications: {
    // Loại driver (ví dụ: "Dynamic", "Planar Magnetic")
    driverType?: string;
    // Kích thước driver (mm, ví dụ: 40)
    driverSize?: number;
    // Dải tần số (Hz, ví dụ: "20-20000")
    frequencyRange?: string;
    // Độ nhạy (dB, ví dụ: 105)
    sensitivity?: number;
    // Trở kháng (Ohms, ví dụ: 32)
    impedance?: number;
    // Công nghệ chống ồn (ví dụ: "Active Noise Cancellation")
    noiseCancellation?: string;
    // Thời lượng pin (giờ, ví dụ: 30)
    batteryLife?: number;
    // Thời gian sạc (giờ, ví dụ: 2)
    chargingTime?: number;
    // Loại cổng sạc (ví dụ: "USB-C")
    chargingPort?: string;
    // Loại micro (ví dụ: "Built-in", "Detachable")
    microphone?: string;
    // Chất lượng âm thanh (ví dụ: "Hi-Res Audio")
    audioQuality?: string;
  };

  // Danh sách biến thể màu sắc
  @Prop({
    type: [
      {
        // Tên màu (ví dụ: "Black")
        color: { type: String, required: true },
        // Đường dẫn đến ảnh của màu (ví dụ: "/image/black.jpg")
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

  // Trọng lượng của tai nghe (gram, ví dụ: 250)
  @Prop({ type: Number })
  weight: number;

  // Kích thước tai nghe (dài x rộng x cao, cm)
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

  // Danh sách thẻ liên quan (ví dụ: ["Wireless", "Noise Cancelling"])
  @Prop({ type: [String], default: [] })
  tags: string[];

  // Kết nối không dây hoặc có dây (ví dụ: ["Bluetooth 5.2", "3.5mm"])
  @Prop({ type: [String], default: [] })
  connectivity: string[];

  // Phụ kiện đi kèm (ví dụ: ["Carrying Case", "Charging Cable"])
  @Prop({ type: [String], default: [] })
  accessories: string[];

  // Đường dẫn SEO-friendly (ví dụ: "sony-wh-1000xm5")
  @Prop({ required: true })
  slug: string;

  // Mã hàng hóa để quản lý kho (ví dụ: "WH1000XM5")
  @Prop({ required: true })
  sku: string;
}

// Tạo schema từ class Headphone
export const HeadphoneSchema = SchemaFactory.createForClass(Headphone);
