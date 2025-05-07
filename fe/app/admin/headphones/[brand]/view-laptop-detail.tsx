import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Laptop } from "@/lib/types/laptop";
import Image from "next/image";
import React from "react";

interface ViewLaptopDetailProps {
  laptop: Laptop;
  children: React.ReactNode;
}

const ViewLaptopDetail = ({ laptop, children }: ViewLaptopDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !max-w-[90%] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết laptop: {laptop.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h1 className="font-semibold text-xl text-gray-900 mb-3">
              Thông tin cơ bản
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Thương hiệu:</strong>{" "}
                {laptop.brand}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Danh mục:</strong>{" "}
                {laptop.category}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá gốc:</strong>{" "}
                {laptop.startingPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá cuối:</strong>{" "}
                {laptop.finalPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Khuyến mãi:</strong>{" "}
                {laptop.isPromotion ? `${laptop.promotion}%` : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trạng thái:</strong>{" "}
                {laptop.isAvailable ? "Có sẵn" : "Hết hàng"}
              </p>
              <p className="text-gray-700 col-span-1 sm:col-span-2">
                <strong className="font-medium">Mô tả:</strong>{" "}
                {laptop.description || "Không có"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bảo hành:</strong>{" "}
                {laptop.warranty || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Ngày phát hành:</strong>{" "}
                {new Date(laptop.releaseDate).toLocaleDateString("vi-VN") ||
                  "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước màn hình:</strong>{" "}
                {laptop.specifications.screenSize
                  ? `${laptop.specifications.screenSize} inch`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Độ phân giải:</strong>{" "}
                {laptop.specifications.resolution || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tần số quét:</strong>{" "}
                {laptop.specifications.refreshRate || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">CPU:</strong>{" "}
                {laptop.specifications.cpu || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">GPU:</strong>{" "}
                {laptop.specifications.gpu || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">RAM:</strong>{" "}
                {laptop.specifications.ram
                  ? `${laptop.specifications.ram} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bộ nhớ:</strong>{" "}
                {laptop.specifications.storage
                  ? `${laptop.specifications.storage} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Pin:</strong>{" "}
                {laptop.specifications.battery
                  ? `${laptop.specifications.battery} Wh`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hệ điều hành:</strong>{" "}
                {laptop.specifications.os || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bàn phím:</strong>{" "}
                {laptop.specifications.keyboard || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Cổng kết nối:</strong>{" "}
                {laptop.specifications.ports?.join(", ") || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Âm thanh:</strong>{" "}
                {laptop.specifications.audio || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Camera</h3>
            <p className="text-gray-700">
              <strong className="font-medium">Webcam:</strong>{" "}
              {laptop.specifications.webcam || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kích thước và trọng lượng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước:</strong>{" "}
                {laptop.dimensions
                  ? `${laptop.dimensions.length} x ${laptop.dimensions.width} x ${laptop.dimensions.height} cm`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trọng lượng:</strong>{" "}
                {laptop.weight ? `${laptop.weight} kg` : "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kết nối
            </h3>
            <p className="text-gray-700">
              <strong className="font-medium">Kết nối:</strong>{" "}
              {laptop.connectivity?.join(", ") || "Không có"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Phụ kiện
            </h3>
            <p className="text-gray-700">
              <strong className="font-medium">Phụ kiện:</strong>{" "}
              {laptop.accessories?.join(", ") || "Không có"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Biến thể màu
            </h3>
            {laptop.colorVariants.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {laptop.colorVariants.map((variant, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`}
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Tags</h3>
            <p className="text-gray-700">
              {laptop.tags.join(", ") || "Không có"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLaptopDetail;
