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
import { useEffect, useState } from "react";
import { apiPatch, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const OrderTable = ({ orders }: { orders: Order[] }) => {
  console.log(orders);
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string>("Tất cả");
  const [search, setSearch] = useState<string>("");
  console.log(orderStatus);
  // Lọc đơn hàng theo trạng thái và tìm kiếm theo mã đơn hàng
  const ordersByStatus = orders.filter((order) => {
    const matchStatus =
      orderStatus === "Tất cả" || order.status === orderStatus;
    const matchSearch =
      search.trim() === "" ||
      order._id.toLowerCase().includes(search.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  const UpdateStatus = async ({
    orderId,
    userId,
    status,
  }: {
    orderId: string;
    userId: string;
    status: string;
  }) => {
    const res = await apiPatch<Order, { status: string }>(`/order/${orderId}`, {
      status: status,
    });
    console.log(res);
    if (res.data) {
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      await apiPost("/notifications", {
        userId,
        message: `Đơn hàng ${orderId} của bạn đã chuyển sang trạng thái ${status}!`,
      });
      router.refresh();
    } else if (res.error) toast.error(res.error);
    else
      toast.error(
        "Có lỗi xảy ra trong quá trình cập nhật trạng thái đơn hàng!"
      );
  };
  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Danh sách đơn hàng
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={orderStatus}
          onValueChange={setOrderStatus}
          defaultValue="Tất cả"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng TableHeadái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả</SelectItem>
            <SelectItem value="Đang chờ xác nhận">Đang chờ xác nhận</SelectItem>
            <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
            <SelectItem value="Đang vận chuyển">Đang vận chuyển</SelectItem>
            <SelectItem value="Hoàn thành">Đã hoàn thành</SelectItem>
            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
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
                  {order.user_id}
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.phone_number}
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.address}
                </TableCell>
                <TableCell>
                  {order.total_amount.toLocaleString("vi-VN", {
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
                  <OrderDetail
                    orderId={order._id}
                    orderDetails={order.orderitem_ids}
                  >
                    <Eye className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-200" />
                  </OrderDetail>
                </TableCell>
                <TableCell className="break-words whitespace-pre-line">
                  {order.status}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 items-center">
                    {order.status === "Đang chờ xác nhận" && (
                      <>
                        <Button
                          onClick={() =>
                            UpdateStatus({
                              orderId: order._id,
                              userId: order.user_id,
                              status: "Đã xác nhận",
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
                              userId: order.user_id,
                              status: "Đã hủy",
                            })
                          }
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200 text-xs w-full"
                        >
                          Hủy đơn
                        </Button>
                      </>
                    )}
                    {order.status === "Đã xác nhận" && (
                      <Button
                        onClick={() =>
                          UpdateStatus({
                            orderId: order._id,
                            userId: order.user_id,
                            status: "Đang vận chuyển",
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
