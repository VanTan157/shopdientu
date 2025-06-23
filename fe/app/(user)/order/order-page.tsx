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
import { Trash2, Eye, Check } from "lucide-react";
import Image from "next/image";
import { Order, OrderStatus } from "@/lib/types/order";
import { apiPatch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OrderPage = ({ orders }: { orders: Order[] }) => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "Tất cả">(
    "Tất cả"
  );
  const [open, setOpen] = useState(false);
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

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const res = await apiPatch<any, { status: OrderStatus }>(
        `/order/${orderId}`,
        {
          status: "Hoàn thành",
        }
      );
      if (res.error) {
        throw new Error(res.error);
      }
      toast.success("Nhận hàng thành công!");
      router.refresh();
    } catch (error) {
      console.error("Error compelete order:", error);
      toast.error("Có lỗi khi nhận đơn hàng!");
    }
  };

  if (orders.length === 0)
    return <div className="text-center py-10">Chưa có đơn hàng nào!</div>;

  const ordersToDisplay =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <section className="px-5 py-8">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text drop-shadow-lg">
        Đơn hàng của bạn
      </h1>

      {/* Lọc theo trạng thái */}
      <div className="my-6">
        <Select
          onValueChange={(value) =>
            setFilterStatus(value as OrderStatus | "Tất cả")
          }
        >
          <SelectTrigger className="w-[200px] border border-cyan-300 bg-white text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-cyan-500">
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
            <TableHead className="text-cyan-300 font-bold text-lg">
              Mã đơn hàng
            </TableHead>
            <TableHead className="text-cyan-300 font-bold text-lg">
              Ngày đặt
            </TableHead>
            <TableHead className="text-cyan-300 font-bold text-lg">
              Tổng tiền
            </TableHead>
            <TableHead className="text-cyan-300 font-bold text-lg">
              Trạng thái
            </TableHead>
            <TableHead className="text-cyan-300 font-bold text-lg">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersToDisplay.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-gray-900 transition-colors"
            >
              <TableCell className="font-semibold">{order._id}</TableCell>
              {/* <TableCell className="flex items-center gap-2 font-semibold">
                {order.orderitem_ids.map((item, index) => (
                  <div key={item._id} className="flex items-center gap-2">
                    <span className="truncate">
                      {item.product.name}
                      {index < order.orderitem_ids.length - 1 && ", "}
                    </span>
                  </div>
                ))}
              </TableCell> */}
              <TableCell className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell className="font-semibold">
                {order.total_amount.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="font-semibold">{order.status}</TableCell>
              <TableCell className="flex gap-2">
                {/* Xem chi tiết */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-blue-800 border-0 hover:bg-blue-200 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!min-w-fit w-full max-h-[90vh] overflow-y-auto">
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
                        <strong>Tổng tiền:</strong>
                        {order.total_amount.toLocaleString("vi-VN")} ₫
                      </p>
                      <h3 className="text-lg font-semibold">Sản phẩm:</h3>
                      {order.orderitem_ids.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-full">
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
                                      alt={item.product.name}
                                      width={40}
                                      height={40}
                                      className="object-contain rounded-md"
                                      quality={100}
                                    />
                                    <span className="truncate">
                                      {item.product.name}
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
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xác nhận hủy đơn</DialogTitle>
                      </DialogHeader>
                      <p>Bạn có chắc muốn hủy đơn hàng {order._id} không?</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
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

                {order.status === "Đang vận chuyển" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-500 hover:bg-green-600"
                        size="icon"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xác nhận nhận hàng</DialogTitle>
                      </DialogHeader>
                      <p>Bạn chắc chắn đã nhận được hàng?</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => {}}>
                          Không
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCompleteOrder(order._id)}
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
