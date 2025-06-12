// components/BtnAddToCart.tsx
"use client";

import { Mobile } from "@/lib/types/mobile";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Từ shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // Từ shadcn/ui
import { Input } from "@/components/ui/input"; // Từ shadcn/ui
import { Label } from "@/components/ui/label"; // Từ shadcn/ui
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BtnAddToCart = ({
  product,
  index,
}: {
  product: Mobile;
  index: number;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    const res = await apiPost("/order-items", {
      product_id: product._id,
      product_type: "mobile",
      quantity,
      colorVariant: product.colorVariants[index],
    });
    console.log(res);
    setLoading(false);
    router.refresh(); // Refresh trang để cập nhật giỏ hàng
    if (res.data) {
      setOpen(false);
      toast.success("Thêm vào giỏ hàng thành công!");
    } else {
      toast.error(res.error || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-8 py-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
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
              disabled={loading}
            />
          </div>
          <p className="text-sm text-gray-500">
            Tồn kho: {product.colorVariants[index].stock} sản phẩm
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button onClick={handleAddToCart} disabled={loading}>
            {loading ? "Đang thêm..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BtnAddToCart;
