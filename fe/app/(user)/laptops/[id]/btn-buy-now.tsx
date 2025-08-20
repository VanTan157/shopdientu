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
import { useAddress } from "@/hooks/useAddress";
import { loadingStore } from "@/app/store/loading.store";
import { EProductType } from "@/lib/types/order";
import { ILaptop } from "@/lib/types/laptop";

const BtnBuyNow = ({ product, index }: { product: ILaptop; index: number }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { stop, start } = loadingStore();

  const {
    provinces,
    districts,
    wards,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    street,
    setStreet,
    getFullAddress,
  } = useAddress();

  const isVietnamesePhoneNumber = (number: string) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };

  const handleConfirmBuy = async () => {
    start();
    if (!product.isAvailable || product.colorVariants[index].stock === 0) {
      toast.error("Sản phẩm không khả dụng hoặc hết hàng!");
      setIsOpen(false);
      return;
    }
    if (quantity > product.colorVariants[index].stock) {
      toast.error(
        `Số lượng vượt quá tồn kho (${product.colorVariants[index].stock})!`
      );
      stop();
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
      stop();
      return;
    }
    if (!isVietnamesePhoneNumber(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    const orderItemData = {
      productId: product._id,
      quantity,
      productName: product.name,
      productType: EProductType.LAPTOP,
      unitPrice: product.finalPrice,
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
      toast.error(orderItemResponse.message);
      return;
    }

    const orderItemId = orderItemResponse.data?._id;

    const orderData = {
      orderitemIds: [orderItemId],
      phoneNumber,
      address: getFullAddress(),
    };

    const orderResponse = await apiPost<any, typeof orderData>(
      "/order",
      orderData
    );

    if (orderResponse.error) {
      toast.error(orderResponse.message);
      return;
    }

    toast.success("Đơn hàng đã được tạo thành công!");
    setIsOpen(false);
    router.refresh();

    stop();
  };

  return (
    <>
      <Button
        className="cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center gap-2 px-8 py-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={
          !product.isAvailable || product.colorVariants[index].stock === 0
        }
        onClick={() => setIsOpen(true)}
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
              />
            </div>
            <div>
              <Label htmlFor="province" className="mb-2">
                Tỉnh/Thành phố
              </Label>
              <Select value={province} onValueChange={setProvince}>
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
                disabled={!province}
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
              <Select value={ward} onValueChange={setWard} disabled={!district}>
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
              />
              <p className="text-sm text-gray-500 mt-1">
                Tồn kho: {product.colorVariants[index].stock}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmBuy}>Xác nhận</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BtnBuyNow;
