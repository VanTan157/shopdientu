import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mobile } from "@/lib/types/mobile";
import Image from "next/image";

interface ViewMobileDetailProps {
  mobile: Mobile;
  children: React.ReactNode; // Để bọc thẻ div từ MobileFilterTable
}

const ViewMobileDetail = ({ mobile, children }: ViewMobileDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90%] overflow-y-auto !max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Chi tiết điện thoại: {mobile.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h1 className="font-semibold text-xl">Thông tin cơ bản</h1>
            <p>
              <strong>Giá gốc:</strong>{" "}
              {mobile.StartingPrice.toLocaleString("vi-VN")} ₫
            </p>
            <p>
              <strong>Giá cuối:</strong>{" "}
              {mobile.finalPrice.toLocaleString("vi-VN")} ₫
            </p>
            <p>
              <strong>Khuyến mãi:</strong>{" "}
              {mobile.IsPromotion ? `${mobile.promotion}%` : "Không"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {mobile.isAvailable ? "Có sẵn" : "Hết hàng"}
            </p>
            <p>
              <strong>Mô tả:</strong> {mobile.description || "Không có"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Thông số kỹ thuật</h3>
            <p>
              <strong>Kích thước màn hình:</strong>{" "}
              {mobile.specifications.screenSize || "N/A"}
            </p>
            <p>
              <strong>Độ phân giải:</strong>{" "}
              {mobile.specifications.resolution || "N/A"}
            </p>
            <p>
              <strong>CPU:</strong> {mobile.specifications.cpu || "N/A"}
            </p>
            <p>
              <strong>RAM:</strong> {mobile.specifications.ram || "N/A"}
            </p>
            <p>
              <strong>Bộ nhớ:</strong> {mobile.specifications.storage || "N/A"}
            </p>
            <p>
              <strong>Pin:</strong> {mobile.specifications.battery || "N/A"}
            </p>
            <p>
              <strong>Hệ điều hành:</strong> {mobile.specifications.os || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Camera</h3>
            <p>
              <strong>Camera sau:</strong> {mobile.camera.rear || "N/A"}
            </p>
            <p>
              <strong>Camera trước:</strong> {mobile.camera.front || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Biến thể màu</h3>
            {mobile.colorVariants.length > 0 ? (
              <ul className="list-disc pl-5">
                {mobile.colorVariants.map((variant, index) => (
                  <div key={index}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`}
                      alt={variant.color}
                      width={100}
                      height={100}
                      className="object-contain rounded-md"
                      quality={100}
                    />
                    {variant.color} - Tồn kho: {variant.stock}
                  </div>
                ))}
              </ul>
            ) : (
              <p>Không có biến thể màu</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-xl">Tags</h3>
            <p>{mobile.tags.join(", ") || "Không có"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMobileDetail;
