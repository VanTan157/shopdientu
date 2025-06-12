"use client";

import { ShoppingBag } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Laptop } from "@/lib/types/laptop";

const BtnBuyNow = ({ product, index }: { product: Laptop; index: number }) => {
  const router = useRouter();

  // State cho form
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const handleBuyNow = async () => {
    setIsOpen(true);
  };

  const isVietnamesePhoneNumber = (number: string) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };
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
      if (
        !phoneNumber ||
        !street ||
        quantity < 1 ||
        !province ||
        !district ||
        !ward
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        setIsLoading(false);
        return;
      }
      if (!isVietnamesePhoneNumber(phoneNumber)) {
        toast.error("Số điện thoại không hợp lệ!");
        return;
      }

      // Bước 1: Tạo OrderItem
      const orderItemData = {
        product_id: product._id,
        product_type: "laptop",
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
        phone_number: phoneNumber,
        address: getFullAddress(),
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
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Error creating order:", error);
        toast.error("Có lỗi khi tạo đơn hàng!");
      }

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
        className="flex items-center gap-2 px-8 py-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          <div className="space-y-4 overflow-y-auto max-h-[70vh]">
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
