"use client";

import { Mobile } from "@/lib/types/mobile";
import { ShoppingBag } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BtnBuyNow = ({ product, index }: { product: Mobile; index: number }) => {
  const router = useRouter();

  // State cho form
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsOpen(true);
  };

  const handleConfirmBuy = async () => {
    setIsLoading(true);
    try {
      // Kiểm tra tính hợp lệ
      if (!product.isAvailable || product.colorVariants[index].stock === 0) {
        toast.error("Sản phẩm không khả dụng hoặc hết hàng!");
        setIsOpen(false);
        return;
      }
      if (quantity > product.colorVariants[index].stock) {
        toast.error(
          `Số lượng vượt quá tồn kho (${product.colorVariants[index].stock})!`
        );
        setIsLoading(false);
        return;
      }
      if (!phoneNumber || !address || quantity < 1) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        setIsLoading(false);
        return;
      }

      // Bước 1: Tạo OrderItem
      const orderItemData = {
        mobile_id: product._id,
        quantity: quantity, // Số lượng từ form
        colorVariant: {
          _id: product.colorVariants[index]._id,
          color: product.colorVariants[index].color,
          image: product.colorVariants[index].image,
        },
      };

      const orderItemResponse = await apiPost<any, typeof orderItemData>(
        "/order-items",
        orderItemData
      );

      if (orderItemResponse.error) {
        throw new Error(orderItemResponse.error);
      }

      const orderItemId = orderItemResponse.data._id;

      // Bước 2: Tạo Order
      const orderData = {
        orderitem_ids: [orderItemId],
        phone_number: phoneNumber, // Từ form
        address: address, // Từ form
      };

      const orderResponse = await apiPost<any, typeof orderData>(
        "/order",
        orderData
      );

      if (orderResponse.error) {
        throw new Error(orderResponse.error);
      }

      toast.success("Đơn hàng đã được tạo thành công!");
      setIsOpen(false);
      router.refresh(); // Refresh trang để cập nhật giỏ hàng
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi khi tạo đơn hàng!");

      // Thử refresh token nếu lỗi do token
      if (
        error instanceof Error &&
        (error.message.includes("Unauthorized") ||
          error.message.includes("Failed to refresh token"))
      ) {
        toast.info("Đang thử lại sau khi làm mới token...");
        handleConfirmBuy(); // Thử lại
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={
          !product.isAvailable || product.colorVariants[index].stock === 0
        }
        onClick={handleBuyNow}
      >
        <ShoppingBag className="w-5 h-5" />
        Mua ngay
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin mua hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber" className="mb-2">
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="address" className="mb-2">
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="mb-2">
                Số lượng
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 1) setQuantity(value);
                }}
                min={1}
                max={product.colorVariants[index].stock}
                placeholder="Nhập số lượng"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Tồn kho: {product.colorVariants[index].stock}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmBuy} disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BtnBuyNow;
