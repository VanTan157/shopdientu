"use client";

import { OrderMobile } from "@/lib/types/order";
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
import { apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const OrderTable = ({ orders }: { orders: OrderMobile[] }) => {
  console.log(orders);
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string>("Tất cả");
  console.log(orderStatus);
  const ordersByStatus = orders.filter((order) => {
    if (orderStatus === "Tất cả") return true; // Hiển thị tất cả đơn hàng
    return order.status === orderStatus; // Hiển thị đơn hàng theo trạng thái đã chọn
  });
  const UpdateStatus = async ({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) => {
    const res = await apiPatch<OrderMobile, { status: string }>(
      `/order/${orderId}`,
      {
        status: status,
      }
    );
    console.log(res);
    if (res.data) {
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      router.refresh();
    } else if (res.error) toast.error(res.error);
    else
      toast.error(
        "Có lỗi xảy ra trong quá trình cập nhật trạng thái đơn hàng!"
      );
  };
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Danh sách đơn hàng
      </h1>
      <Select
        value={orderStatus}
        onValueChange={setOrderStatus}
        defaultValue="Tất cả"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái đơn hàng" />
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
      <div className="pt-4">
        <div className=" bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-xs text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã người đặt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Địa chỉ giao hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chi tiết sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordersByStatus.map((order, index) => (
                <tr
                  key={order._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">{order._id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.user_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.phone_number}
                  </td>
                  <td className="px-4 py-3">{order.address}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.total_amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <OrderDetail
                      orderId={order._id}
                      orderDetails={order.orderitem_ids}
                    >
                      <Eye className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-200" />
                    </OrderDetail>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.status}
                  </td>
                  <td className="px-4 py-3 space-y-2">
                    {order.status === "Đang chờ xác nhận" && (
                      <>
                        <Button
                          onClick={() =>
                            UpdateStatus({
                              orderId: order._id,
                              status: "Đã xác nhận",
                            })
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                        >
                          Xác nhận
                        </Button>
                        <Button
                          onClick={() =>
                            UpdateStatus({
                              orderId: order._id,
                              status: "Đã hủy",
                            })
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200"
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
                            status: "Đang vận chuyển",
                          })
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                      >
                        Vận chuyển
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
