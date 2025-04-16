// app/cart/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItemMobile } from "@/lib/types/order-item";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { apiDelete, apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input"; // Thêm Input từ shadcn/ui
import { Label } from "@/components/ui/label"; // Thêm Label từ shadcn/ui
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartPage = ({ carts }: { carts: CartItemMobile[] }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const router = useRouter();

  // Xử lý chọn/bỏ chọn sản phẩm
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Tính tổng tiền của các sản phẩm được chọn
  const selectedTotal = carts
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.total_price, 0);

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = async (itemId: string) => {
    try {
      const res = await apiDelete<any>(`/order-items/${itemId}`);
      if (res.error) {
        throw new Error(res.error);
      }
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      toast.success("Xóa sản phẩm thành công!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Có lỗi khi xóa sản phẩm!");
    }
  };

  // Xác nhận mua các sản phẩm được chọn
  const handleCheckout = async () => {
    console.log("Selected items:", selectedItems);
    if (!phoneNumber || !address) {
      alert("Vui lòng nhập số điện thoại và địa chỉ!");
      return;
    }
    try {
      const orderData = {
        orderitem_ids: selectedItems,
        phone_number: phoneNumber,
        address: address,
      };
      const res = await apiPost<any, typeof orderData>("/order", orderData);
      if (res.error) {
        throw new Error(res.error);
      }
      toast.success("Đặt hàng thành công!");
      router.refresh();
      setSelectedItems([]);
      setPhoneNumber("");
      setAddress("");
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Có lỗi khi đặt hàng!");
    }
  };

  if (carts.length === 0) {
    return <div className="text-center py-10">Giỏ hàng trống!</div>;
  }

  return (
    <section className="p-5">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {/* Bảng danh sách sản phẩm */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedItems.length === carts.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems(carts.map((item) => item._id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Màu sắc</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Tổng giá</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((item) => (
            <TableRow key={item._id} onClick={() => handleSelectItem(item._id)}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onCheckedChange={() => handleSelectItem(item._id)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.colorVariant.image}`}
                  alt={item.mobile_id.name}
                  width={50}
                  height={50}
                  className="object-contain rounded-md"
                />
                <span>{item.mobile_id.name}</span>
              </TableCell>
              <TableCell>{item.colorVariant.color}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit_price.toLocaleString("vi-VN")} ₫</TableCell>
              <TableCell>
                {item.total_price.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Xác nhận xóa</DialogTitle>
                    </DialogHeader>
                    <p>
                      Bạn có chắc muốn xóa {item.mobile_id.name} khỏi giỏ hàng?
                    </p>
                    <DialogFooter>
                      <Button variant="outline">Hủy</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                      >
                        Xóa
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Tổng tiền và nút mua ngay */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">
          Tổng cộng: {selectedTotal.toLocaleString("vi-VN")} ₫
        </p>
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600"
              disabled={selectedItems.length === 0}
            >
              <ShoppingBag className="w-5 h-5" />
              Xác nhận mua
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thông tin đặt hàng</DialogTitle>
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
                />
              </div>
              <div>
                <Label htmlFor="address" className="mb-2">
                  Địa chỉ giao hàng
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCheckoutOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCheckout}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default CartPage;
