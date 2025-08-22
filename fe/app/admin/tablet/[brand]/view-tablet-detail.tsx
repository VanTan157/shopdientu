import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ITablet } from "@/lib/types/tablet";
import Image from "next/image";
import React from "react";

const ViewLaptopDetail = ({
  tablet,
  children,
}: {
  tablet: ITablet;
  children: React.ReactNode;
}) => {
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
                <strong className="font-medium">Thương hiệu: </strong>{" "}
                {tablet.brand}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tổng tồn kho: </strong>{" "}
                {tablet.totalStock}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá gốc: </strong>{" "}
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
              <p className="text-gray-700">
                <strong className="font-medium">Bảo hành:</strong>{" "}
                {tablet.warranty || "N/A"}
              </p>
              <p className="text-gray-700 col-span-1 sm:col-span-2 whitespace-pre-wrap">
                <strong className="font-medium">Mô tả:</strong>{" "}
                {tablet.description || "Không có"}
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
                {tablet.specifications?.screenSize
                  ? `${tablet.specifications.screenSize} inch`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Độ phân giải:</strong>{" "}
                {tablet.specifications?.resolution || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tần số quét:</strong>{" "}
                {tablet.specifications?.refreshRate
                  ? `${tablet.specifications.refreshRate} Hz`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Loại SIM:</strong>{" "}
                {tablet.specifications?.simType || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">RAM:</strong>{" "}
                {tablet.specifications?.ram
                  ? `${tablet.specifications.ram} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bộ nhớ:</strong>{" "}
                {tablet.specifications?.storage
                  ? `${tablet.specifications.storage} GB`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Pin:</strong>{" "}
                {tablet.specifications?.battery
                  ? `${tablet.specifications.battery} mAh`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hệ điều hành:</strong>{" "}
                {tablet.specifications?.os || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Camera</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Camera sau:</strong>{" "}
                {tablet.specifications?.camera?.rear || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Camera trước:</strong>{" "}
                {tablet.specifications?.camera?.front || "N/A"}
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
                {tablet.dimensions?.weight
                  ? `${tablet.dimensions.weight} g`
                  : "N/A"}
              </p>
            </div>
          </div>
          {tablet.accessories && tablet.accessories.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Phụ kiện
              </h3>
              <div className="flex flex-wrap gap-2">
                {tablet.accessories.map((accessory, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {accessory}
                  </span>
                ))}
              </div>
            </div>
          )}
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
          {tablet.tags && tablet.tags.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tablet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLaptopDetail;
