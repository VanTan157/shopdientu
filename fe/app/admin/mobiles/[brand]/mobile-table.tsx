"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ViewMobileDetail from "./view-mobile-detail";
import DeleteMobile from "./delete-mobile";
import EditMobile from "./edit-mobile";
import { IMobile } from "@/lib/types/mobile";

const MobileTable = ({
  mobiles,
  brands,
}: {
  mobiles: IMobile[];
  brands: string[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPromotion, setFilterPromotion] = useState<string>("");

  const filteredMobiles = mobiles.filter((mobile) => {
    const matchesSearch = mobile.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" || mobile.isAvailable.toString() === filterStatus;
    const matchesPromotion =
      filterPromotion === "" ||
      mobile.isPromotion.toString() === filterPromotion;
    return matchesSearch && matchesStatus && matchesPromotion;
  });
  if (mobiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg text-gray-600 font-medium">
          Không tìm thấy điện thoại nào
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Có sẵn</option>
              <option value="false">Hết hàng</option>
            </select>
            <select
              value={filterPromotion}
              onChange={(e) => setFilterPromotion(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Tất cả khuyến mãi</option>
              <option value="true">Đang khuyến mãi</option>
              <option value="false">Không khuyến mãi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách điện thoại */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead className="text-center">Tên</TableHead>
              <TableHead className="text-center">Giá gốc</TableHead>
              <TableHead className="text-center">Giá cuối</TableHead>
              <TableHead className="text-center">Khuyến mãi</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMobiles.map((mobile, index) => (
              <TableRow key={mobile._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{mobile.name}</TableCell>
                <TableCell className="text-center">
                  {mobile.startingPrice.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell className="text-center">
                  {mobile.finalPrice.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell className="text-center">
                  {mobile.isPromotion ? `${mobile.promotion}%` : "Không"}
                </TableCell>
                <TableCell className="text-center">
                  {mobile.isAvailable ? "Có sẵn" : "Hết hàng"}
                </TableCell>
                <TableCell className="flex gap-2 justify-center items-center">
                  <ViewMobileDetail mobile={mobile}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </div>
                  </ViewMobileDetail>
                  <EditMobile mobile={mobile} brands={brands}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-white hover:bg-gray-200 cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </div>
                  </EditMobile>
                  <DeleteMobile id={mobile._id}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </DeleteMobile>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MobileTable;
