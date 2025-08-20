import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IMobile } from "@/lib/types/mobile";
import Image from "next/image";
import React from "react";

interface ViewMobileDetailProps {
  mobile: IMobile;
  children: React.ReactNode;
}

const ViewMobileDetail = ({ mobile, children }: ViewMobileDetailProps) => {
  console.log(mobile);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !max-w-[90%] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết điện thoại: {mobile.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h1 className="font-semibold text-xl text-gray-900 mb-3">
              Thông tin cơ bản
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Thương hiệu: </strong>
                {mobile.brand || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bảo hành: </strong>
                {mobile.warranty || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá gốc: </strong>
                {mobile.startingPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Giá cuối: </strong>
                {mobile.finalPrice.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Khuyến mãi: </strong>
                {mobile.isPromotion ? `${mobile.promotion}%` : "Không"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trạng thái: </strong>
                {mobile.isAvailable ? "Có sẵn" : "Hết hàng"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tổng tồn kho: </strong>
                {mobile.totalStock}
              </p>
              <p className="text-gray-700 col-span-1 sm:col-span-2 whitespace-pre-wrap">
                <strong className="font-medium">Mô tả: </strong>
                {mobile.description || "Không có"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Kích thước màn hình: </strong>
                {mobile.specifications.screenSize} inch
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Độ phân giải: </strong>
                {mobile.specifications.resolution || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Tần số quét: </strong>
                {mobile.specifications.refreshRate} Hz
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Loại SIM: </strong>
                {mobile.specifications.simType || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">RAM: </strong>
                {mobile.specifications.ram} GB
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Bộ nhớ: </strong>
                {mobile.specifications.storage} GB
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Pin: </strong>
                {mobile.specifications.battery} mAh
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Hệ điều hành: </strong>
                {mobile.specifications.os || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">Camera</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Camera sau: </strong>
                {mobile.specifications.camera.rear || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Camera trước: </strong>
                {mobile.specifications.camera.front || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Kích thước và trọng lượng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">Chiều dài: </strong>
                {mobile.dimensions?.length || 0} mm
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Chiều rộng: </strong>
                {mobile.dimensions?.width || 0} mm
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Chiều cao: </strong>
                {mobile.dimensions?.height || 0} mm
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Trọng lượng: </strong>
                {mobile.dimensions?.weight || 0} g
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Biến thể màu
            </h3>
            {mobile.colorVariants.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mobile.colorVariants.map((variant, index) => (
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
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">
                        {variant.color}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Tồn kho: {variant.stock}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">Không có biến thể màu</p>
            )}
          </div>

          {mobile.accessories && mobile.accessories.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Phụ kiện
              </h3>
              <div className="flex flex-wrap gap-2">
                {mobile.accessories.map((accessory, index) => (
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

          {mobile.tags && mobile.tags.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mobile.tags.map((tag, index) => (
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              Thông tin hệ thống
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="font-medium">ID sản phẩm: </strong>
                {mobile._id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMobileDetail;
