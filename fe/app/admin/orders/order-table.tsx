"use client";

import OrderDetail from "./order-detail";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { apiGet, apiPatch, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EOrderStatus, Order } from "@/lib/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IOrderItem } from "@/lib/types/order-item";
import { loadingStore } from "@/app/store/loading.store";

const OrderTable = ({ orders }: { orders: Order[] }) => {
  const { start, stop } = loadingStore();
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<EOrderStatus>(
    EOrderStatus.ALL
  );
  const [search, setSearch] = useState<string>("");
  const ordersByStatus = orders.filter((order) => {
    const matchStatus =
      orderStatus === EOrderStatus.ALL || order.status === orderStatus;
    const matchSearch =
      search.trim() === "" ||
      order._id.toLowerCase().includes(search.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);

  const handleViewDetails = async (order: Order) => {
    start();
    try {
      const itemPromises = order.orderitemIds.map((itemId) =>
        apiGet<IOrderItem>(`/order-items/${itemId}`)
      );
      const results = await Promise.all(itemPromises);
      const items = results
        .filter((result) => result && result.data)
        .map((result) => result.data!);
      setOrderItems(items);
      console.log("Order item details:", items);
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Có lỗi khi lấy chi tiết đơn hàng!");
      setOrderItems([]);
    } finally {
      stop();
    }
  };

  const UpdateStatus = async ({
    orderId,
    userId,
    status,
  }: {
    orderId: string;
    userId: string;
    status: string;
  }) => {
    start();
    const res = await apiPatch<Order, { status: string }>(`/order/${orderId}`, {
      status: status,
    });
    if (res.data) {
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      await apiPost(
        "/notifications",
        {
          userId,
          message: `Đơn hàng ${orderId} của bạn đã chuyển sang trạng thái ${status}!`,
        },
        undefined,
        ["notification"]
      );
      router.refresh();
    } else if (res.error) toast.error(res.error);
    else toast.error(res.message);
    stop();
  };
  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Danh sách đơn hàng
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={orderStatus}
          onValueChange={(value) => setOrderStatus(value as EOrderStatus)}
          defaultValue={EOrderStatus.ALL}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EOrderStatus.ALL}>{EOrderStatus.ALL}</SelectItem>
            <SelectItem value={EOrderStatus.PENDING}>
              {EOrderStatus.PENDING}
            </SelectItem>
            <SelectItem value={EOrderStatus.CONFIRMED}>
              {EOrderStatus.CONFIRMED}
            </SelectItem>
            <SelectItem value={EOrderStatus.SHIPPED}>
              {EOrderStatus.SHIPPED}
            </SelectItem>
            <SelectItem value={EOrderStatus.COMPLETED}>
              {EOrderStatus.COMPLETED}
            </SelectItem>
            <SelectItem value={EOrderStatus.CANCELED}>
              {EOrderStatus.CANCELED}
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-4 w-[300px] text-sm"
        />
      </div>
      <div className="p-4 shadow-md rounded-lg bg-white mt-8 w-full">
        <Table className="w-full table-fixed text-xs">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow>
              <TableHead className="w-[90px]  break-words">
                Mã đơn hàng
              </TableHead>
              <TableHead className="w-[90px]  break-words">
                Mã người đặt
              </TableHead>
              <TableHead className="w-[90px]  break-words">
                Số điện thoại
              </TableHead>
              <TableHead className="w-[140px] break-words">
                Địa chỉ giao hàng
              </TableHead>
              <TableHead className="w-[90px]  break-words">Tổng tiền</TableHead>
              <TableHead className="w-[90px]  break-words">Ngày tạo</TableHead>
              <TableHead className="w-[60px] break-words">Chi tiết</TableHead>
              <TableHead className="w-[90px]  break-words">
                Trạng thái
              </TableHead>
              <TableHead className="w-[100px] break-words">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersByStatus.map((order, index) => (
              <TableRow key={order._id} className="align-top">
                <TableCell className="break-words whitespace-pre-line">
                  {order._id}
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.userId}
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.phoneNumber}
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.address}
                </TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-2 py-2">
                  <OrderDetail orderItems={orderItems}>
                    <Eye
                      className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-200"
                      onClick={() => handleViewDetails(order)}
                    />
                  </OrderDetail>
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.status}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 items-center">
                    {order.status === EOrderStatus.PENDING && (
                      <>
                        <Button
                          onClick={() =>
                            UpdateStatus({
                              orderId: order._id,
                              userId: order.userId,
                              status: EOrderStatus.CONFIRMED,
                            })
                          }
                          className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-xs w-full"
                        >
                          Xác nhận
                        </Button>
                        <Button
                          onClick={() =>
                            UpdateStatus({
                              orderId: order._id,
                              userId: order.userId,
                              status: EOrderStatus.CANCELED,
                            })
                          }
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200 text-xs w-full"
                        >
                          Hủy đơn
                        </Button>
                      </>
                    )}
                    {order.status === EOrderStatus.CONFIRMED && (
                      <Button
                        onClick={() =>
                          UpdateStatus({
                            orderId: order._id,
                            userId: order.userId,
                            status: EOrderStatus.SHIPPED,
                          })
                        }
                        className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-xs w-full"
                      >
                        Vận chuyển
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default OrderTable;
