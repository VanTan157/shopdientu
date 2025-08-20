import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IHeadphone } from "@/lib/types/headphone";
import Image from "next/image";
import React from "react";

interface ViewHeadphoneDetailProps {
  headphone: IHeadphone;
  children: React.ReactNode;
}

const ViewHeadphoneDetail = ({
  headphone,
  children,
}: ViewHeadphoneDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !max-w-[90%] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết tai nghe: {headphone.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h1 className="font-semibold text-xl text-gray-900 mb-3">
              Thông tin cơ bản
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Thương hiệu:</strong>{" "}
                {headphone.brand}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá gốc:</strong>{" "}
                {headphone.startingPrice?.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá cuối:</strong>{" "}
                {headphone.finalPrice?.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Khuyến mãi:</strong>{" "}
                {headphone.isPromotion ? `${headphone.promotion}%` : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trạng thái:</strong>{" "}
                {headphone.isAvailable ? "Có sẵn" : "Hết hàng"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bảo hành:</strong>{" "}
                {headphone.warranty || "N/A"}
              </p>
              <p className="text-gray-700 col-span-1 sm:col-span-2 whitespace-pre-wrap">
                <strong className="font-medium">Mô tả:</strong>{" "}
                {headphone.description || "Không có"}
              </p>
            </div>
          </div>
          {/* Thông số kỹ thuật */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Loại driver:</strong>{" "}
                {headphone.specifications?.driverType || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước driver:</strong>{" "}
                {headphone.specifications?.driverSize
                  ? `${headphone.specifications.driverSize} mm`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Dải tần số:</strong>{" "}
                {headphone.specifications?.frequencyRange || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trở kháng:</strong>{" "}
                {headphone.specifications?.impedance
                  ? `${headphone.specifications.impedance} Ω`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Chống ồn:</strong>{" "}
                {headphone.specifications?.noiseCancellation || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Thời lượng pin:</strong>{" "}
                {headphone.specifications?.batteryLife
                  ? `${headphone.specifications.batteryLife} giờ`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Thời gian sạc:</strong>{" "}
                {headphone.specifications?.chargingTime
                  ? `${headphone.specifications.chargingTime} giờ`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Cổng sạc:</strong>{" "}
                {headphone.specifications?.chargingPort || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Micro:</strong>{" "}
                {headphone.specifications?.microphone ? "Có" : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Kết nối:</strong>{" "}
                {headphone.specifications?.connectivity || "N/A"}
              </p>
            </div>
          </div>
          {/* Kích thước và trọng lượng */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kích thước & Trọng lượng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước:</strong>{" "}
                {headphone.dimensions
                  ? `${headphone.dimensions.length} x ${headphone.dimensions.width} x ${headphone.dimensions.height} mm`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trọng lượng:</strong>{" "}
                {headphone.dimensions?.weight
                  ? `${headphone.dimensions.weight} g`
                  : "N/A"}
              </p>
            </div>
          </div>
          {/* Phụ kiện */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Phụ kiện
            </h3>
            <p className="text-gray-700">
              <strong className="font-medium">Phụ kiện:</strong>{" "}
              {headphone.accessories?.length
                ? headphone.accessories.join(", ")
                : "Không có"}
            </p>
          </div>
          {/* Biến thể màu */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Biến thể màu
            </h3>
            {headphone.colorVariants?.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {headphone.colorVariants.map((variant, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
                  >
                    <Image
                      src={
                        variant.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
                          : variant.image
                      }
                      alt={variant.color}
                      width={100}
                      height={100}
                      className="object-contain rounded-md"
                      quality={100}
                    />
                    <span className="text-gray-700">
                      {variant.color} - Tồn kho: {variant.stock}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">Không có biến thể màu</p>
            )}
          </div>
          {/* Tags */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Tags</h3>
            <p className="text-gray-700">
              {headphone.tags?.length ? headphone.tags.join(", ") : "Không có"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewHeadphoneDetail;
