import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CartItem } from "@/lib/types/order-item";
import Image from "next/image";

interface OrderDetailProps {
  orderId: string;
  orderDetails: CartItem[];
  children: React.ReactNode;
}

const OrderDetail = ({ orderId, orderDetails, children }: OrderDetailProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full sm:w-[90%] p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Chi tiết sản phẩm của đơn hàng: {orderId}
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-2">
            Thông tin chi tiết về các sản phẩm trong đơn hàng.
          </DialogDescription>
          <div className="mt-6 space-y-4">
            {orderDetails.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.colorVariant.image}`}
                  alt={item.colorVariant.color}
                  width={100}
                  height={100}
                  quality={100}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {item.colorVariant.color}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Đơn giá:{" "}
                    {item.unit_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Tổng giá:{" "}
                    {item.total_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetail;
