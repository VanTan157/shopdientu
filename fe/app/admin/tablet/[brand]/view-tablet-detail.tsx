import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tablet } from "@/lib/types/tablet";
import { table } from "console";
import Image from "next/image";
import React from "react";

interface ViewLaptopDetailProps {
  tablet: Tablet;
  children: React.ReactNode;
}

const ViewLaptopDetail = ({ tablet, children }: ViewLaptopDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !max-w-[90%] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết tablet: {tablet.name}
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
                {tablet.brand}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Danh mục:</strong>{" "}
                {tablet.category}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá gốc:</strong>{" "}
                {tablet.startingPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá cuối:</strong>{" "}
                {tablet.finalPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Khuyến mãi:</strong>{" "}
                {tablet.isPromotion ? `${tablet.promotion}%` : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trạng thái:</strong>{" "}
                {tablet.isAvailable ? "Có sẵn" : "Hết hàng"}
              </p>
              <p className="text-gray-700 col-span-1 sm:col-span-2 whitespace-pre-wrap">
                <strong className="font-medium">Mô tả:</strong>{" "}
                {tablet.description || "Không có"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bảo hành:</strong>{" "}
                {tablet.warranty || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">SKU:</strong> {tablet.sku}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Slug:</strong> {tablet.slug}
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
                {tablet.specifications.screenSize
                  ? `${tablet.specifications.screenSize} inch`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Độ phân giải:</strong>{" "}
                {tablet.specifications.resolution || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tần số quét:</strong>{" "}
                {tablet.specifications.refreshRate || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">CPU:</strong>{" "}
                {tablet.specifications.cpu || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">GPU:</strong>{" "}
                {tablet.specifications.gpu || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">RAM:</strong>{" "}
                {tablet.specifications.ram
                  ? `${tablet.specifications.ram} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bộ nhớ:</strong>{" "}
                {tablet.specifications.storage
                  ? `${tablet.specifications.storage} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Pin:</strong>{" "}
                {tablet.specifications.battery
                  ? `${tablet.specifications.battery} Wh`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hệ điều hành:</strong>{" "}
                {tablet.specifications.os || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Cổng kết nối:</strong>{" "}
                {tablet.specifications.ports?.join(", ") || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Âm thanh:</strong>{" "}
                {tablet.specifications.audio || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hỗ trợ SIM:</strong>{" "}
                {tablet.specifications.simSupport ? "Có" : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hỗ trợ bút cảm ứng:</strong>{" "}
                {tablet.specifications.stylusSupport ? "Có" : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Âm thanh:</strong>{" "}
                {tablet.specifications.audio || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Cổng sạc:</strong>{" "}
                {tablet.specifications?.ports || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Camera</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Camera sau:</strong>{" "}
                {tablet.specifications.cameraRear || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Camera trước:</strong>{" "}
                {tablet.specifications.cameraFront || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kích thước và trọng lượng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước:</strong>{" "}
                {tablet.dimensions
                  ? `${tablet.dimensions.length} x ${tablet.dimensions.width} x ${tablet.dimensions.height} mm`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trọng lượng:</strong>{" "}
                {tablet.weight ? `${tablet.weight} kg` : "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kết nối
            </h3>
            <p className="text-gray-700">
              <strong className="font-medium">Kết nối:</strong>{" "}
              {tablet.connectivity?.join(", ") || "Không có"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Phụ kiện
            </h3>
            <p className="text-gray-700">
              <strong className="font-medium">Phụ kiện:</strong>{" "}
              {tablet.accessories?.join(", ") || "Không có"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Biến thể màu
            </h3>
            {tablet.colorVariants.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tablet.colorVariants.map((variant, index) => (
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
              {tablet.tags.join(", ") || "Không có"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLaptopDetail;
