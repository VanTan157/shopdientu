"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Headphone } from "@/lib/types/headphone";
import { useCartStore } from "@/app/store/cart-store";
import { EProductType } from "@/lib/types/order";
import { loadingStore } from "@/app/store/loading.store";

const BtnAddToCart = ({
  product,
  index,
}: {
  product: Headphone;
  index: number;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const { start, stop } = loadingStore();
  const { cartItemCount, setCartItemCount } = useCartStore();
  const router = useRouter();

  const handleAddToCart = async () => {
    start();
    try {
      const res = await apiPost("/order-items", {
        product_id: product._id,
        product_type: EProductType.HEADPHONE,
        quantity,
        colorVariant: product.colorVariants[index],
      });
      router.refresh();
      if (res.data) {
        setOpen(false);
        setCartItemCount(cartItemCount + 1);
        toast.success("Thêm vào giỏ hàng thành công!");
      } else {
        toast.error(res.error || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi khi tạo đơn hàng!");
      }
    } finally {
      stop();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer hover:scale-110 transition-transform duration-200s"
          disabled={
            !product.isAvailable || product.colorVariants[index].stock === 0
          }
        >
          <ShoppingCart className="w-5 h-5" />
          Thêm vào giỏ hàng
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm {product.name} vào giỏ hàng</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Số lượng
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              min={1}
              max={product.colorVariants[index].stock}
              className="col-span-3"
            />
          </div>
          <p className="text-sm text-gray-500">
            Tồn kho: {product.colorVariants[index].stock} sản phẩm
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddToCart}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BtnAddToCart;
