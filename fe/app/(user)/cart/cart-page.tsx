// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
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
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { apiDelete, apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input"; // Thêm Input từ shadcn/ui
import { Label } from "@/components/ui/label"; // Thêm Label từ shadcn/ui
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartItem } from "@/lib/types/order-item";
import { useCartStore } from "@/app/store/cart-store";
import { se } from "date-fns/locale";

const CartPage = ({ carts }: { carts: CartItem[] }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const { cartItemCount, setCartItemCount } = useCartStore();

  // Gọi API tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("/api/provinces", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch provinces");
        }
        const data = await response.json();
        console.log("check", data);
        setProvinces(data.results);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố!");
      }
    };
    fetchProvinces();
  }, [province]);

  useEffect(() => {
    if (district) {
      const fetchWards = async () => {
        try {
          const response = await fetch(`/api/wards/${district}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch wards");
          }
          const data = await response.json();
          setWards(data.results);
          setWard("");
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Không thể tải danh sách phường/xã!");
        }
      };
      fetchWards();
    }
  }, [district]);

  useEffect(() => {
    if (province) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`/api/districts/${province}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch districts");
          }
          const data = await response.json();
          setDistricts(data.results);
          setDistrict("");
          setWards([]);
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Không thể tải danh sách quận/huyện!");
        }
      };
      fetchDistricts();
    }
  }, [province]);

  const getFullAddress = () => {
    const provinceName =
      provinces.find((p) => p.province_id === province)?.province_name || "";
    const districtName =
      districts.find((d) => d.district_id === district)?.district_name || "";
    const wardName = wards.find((w) => w.ward_id === ward)?.ward_name || "";
    return `${street}, ${wardName}, ${districtName}, ${provinceName}`;
  };

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
      setCartItemCount(carts.length - 1);
      toast.success("Xóa sản phẩm thành công!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Có lỗi khi xóa sản phẩm!");
    }
  };
  const isVietnamesePhoneNumber = (number: string) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };
  // Xác nhận mua các sản phẩm được chọn
  const handleCheckout = async () => {
    console.log("Selected items:", selectedItems);
    if (!phoneNumber || !street || !province || !district || !ward) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!isVietnamesePhoneNumber(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    try {
      const orderData = {
        orderitem_ids: selectedItems,
        phone_number: phoneNumber,
        address: getFullAddress(),
      };
      console.log("Order data:", orderData);
      const res = await apiPost<any, typeof orderData>("/order", orderData);
      if (res.error) {
        throw new Error(res.error);
      }
      setCartItemCount(cartItemCount - selectedItems.length); // Reset cart item count
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
      <h1 className="text-4xl pb-6 font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text drop-shadow-lg">
        Giỏ hàng của bạn
      </h1>

      {/* Bảng danh sách sản phẩm */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                className={
                  "border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                }
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
            <TableHead className="text-cyan-400 font-bold text-lg">
              Sản phẩm
            </TableHead>
            <TableHead className="text-cyan-400 font-bold text-lg">
              Màu sắc
            </TableHead>
            <TableHead className="text-cyan-400 font-bold text-lg">
              Số lượng
            </TableHead>
            <TableHead className="text-cyan-400 font-bold text-lg">
              Đơn giá
            </TableHead>
            <TableHead className="text-cyan-400 font-bold text-lg">
              Tổng giá
            </TableHead>
            <TableHead className="text-cyan-400 font-bold text-lg">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((item) => (
            <TableRow
              key={item._id}
              onClick={() => handleSelectItem(item._id)}
              className="hover:bg-gray-900 transition-colors"
            >
              <TableCell>
                <Checkbox
                  className="border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  checked={selectedItems.includes(item._id)}
                  onCheckedChange={() => handleSelectItem(item._id)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.colorVariant.image}`}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="object-contain rounded-md"
                />
                <span className="font-semibold">{item.product.name}</span>
              </TableCell>
              <TableCell className="font-semibold">
                {item.colorVariant.color}
              </TableCell>
              <TableCell className="font-semibold">{item.quantity}</TableCell>
              <TableCell className="font-semibold">
                {item.unit_price.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="font-semibold">
                {item.total_price.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="font-semibold">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:cursor-pointer hover:scale-110 transition-transform duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Xác nhận xóa</DialogTitle>
                    </DialogHeader>
                    <p>
                      Bạn có chắc muốn xóa {item.product.name} khỏi giỏ hàng?
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
              className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 hover:scale-105 transition-transform duration-200 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Label htmlFor="province" className="mb-2">
                  Tỉnh/Thành phố
                </Label>
                <Select
                  value={province}
                  onValueChange={setProvince}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.province_id} value={p.province_id}>
                        {p.province_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district" className="mb-2">
                  Quận/Huyện
                </Label>
                <Select
                  value={district}
                  onValueChange={setDistrict}
                  disabled={isLoading || !province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.district_id} value={d.district_id}>
                        {d.district_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ward" className="mb-2">
                  Phường/Xã
                </Label>
                <Select
                  value={ward}
                  onValueChange={setWard}
                  disabled={isLoading || !district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((w) => (
                      <SelectItem key={w.ward_id} value={w.ward_id}>
                        {w.ward_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="street" className="mb-2">
                  Đường, số nhà
                </Label>
                <Input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Nhập đường, số nhà"
                  disabled={isLoading}
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
