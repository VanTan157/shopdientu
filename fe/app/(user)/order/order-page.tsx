// app/orders/page.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { OrderMobile, OrderStatus } from "@/lib/validate/order";
import { apiPatch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OrderPage = ({ orders }: { orders: OrderMobile[] }) => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "Tất cả">(
    "Tất cả"
  );
  const router = useRouter();

  // Các trạng thái đơn hàng
  const statuses: (OrderStatus | "Tất cả")[] = [
    "Tất cả",
    "Đang chờ xác nhận",
    "Đã xác nhận",
    "Đang vận chuyển",
    "Hoàn thành",
    "Đã hủy",
  ];

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await apiPatch<any, { status: OrderStatus }>(
        `/order/${orderId}`,
        {
          status: "Đã hủy",
        }
      );
      if (res.error) {
        throw new Error(res.error);
      }
      toast.success("Hủy đơn hàng thành công!");
      router.refresh();
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Có lỗi khi hủy đơn hàng!");
    }
  };

  if (orders.length === 0)
    return <div className="text-center py-10">Chưa có đơn hàng nào!</div>;

  const ordersToDisplay =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <section className="p-5">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của bạn</h1>

      {/* Lọc theo trạng thái */}
      <div className="mb-6">
        <Select
          onValueChange={(value) =>
            setFilterStatus(value as OrderStatus | "Tất cả")
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Ngày đặt</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersToDisplay.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>
                {order.total_amount.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className="flex gap-2">
                {/* Xem chi tiết */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Chi tiết đơn hàng: {order._id}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>
                        <strong>Số điện thoại:</strong> {order.phone_number}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {order.address}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {order.total_amount.toLocaleString("vi-VN")} ₫
                      </p>
                      <h3 className="text-lg font-semibold">Sản phẩm:</h3>
                      {order.orderitem_ids.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[150px]">
                                  Sản phẩm
                                </TableHead>
                                <TableHead>Màu sắc</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead className="text-right">
                                  Tổng giá
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.orderitem_ids.map((item) => (
                                <TableRow key={item._id}>
                                  <TableCell className="flex items-center gap-2">
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.colorVariant.image}`}
                                      alt={item.mobile_id.name}
                                      width={40}
                                      height={40}
                                      className="object-contain rounded-md"
                                    />
                                    <span className="truncate">
                                      {item.mobile_id.name}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {item.colorVariant.color}
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell className="text-right">
                                    {item.total_price.toLocaleString("vi-VN")} ₫
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p>Không có sản phẩm trong đơn hàng này.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Hủy đơn (chỉ khi trạng thái cho phép) */}
                {order.status === "Đang chờ xác nhận" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xác nhận hủy đơn</DialogTitle>
                      </DialogHeader>
                      <p>Bạn có chắc muốn hủy đơn hàng {order._id} không?</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => {}}>
                          Không
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Có
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default OrderPage;
