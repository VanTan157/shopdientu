"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import ViewHeadphoneDetail from "./view-headphone-detail";
import EditHeadphone from "./edit-headphone";
import DeleteHeadphone from "./delete-headphone";
import { IHeadphone } from "@/lib/types/headphone";

const HeadphoneTable = ({
  headphones,
  brands,
}: {
  headphones: IHeadphone[];
  brands: string[];
}) => {
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");
  const [filterPromotion, setFilterPromotion] = useState<string>("Tất cả");

  const filteredHeadphones = headphones.filter((headphone) => {
    const matchesSearch = headphone.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesStatus =
      filterStatus === "Tất cả" ||
      headphone.isAvailable.toString() === filterStatus;
    const matchesPromotion =
      filterPromotion === "Tất cả" ||
      headphone.isPromotion.toString() === filterPromotion;
    return matchesSearch && matchesStatus && matchesPromotion;
  });

  return (
    <>
      <div className="flex gap-4 items-center justify-between p-4 bg-white shadow-md rounded-lg">
        <Input
          placeholder="Tìm kiếm theo tên tai nghe..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
          defaultValue="Tất cả"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả</SelectItem>
            <SelectItem value="true">Có sẵn</SelectItem>
            <SelectItem value="false">Hết hàng</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterPromotion}
          onValueChange={setFilterPromotion}
          defaultValue="Tất cả"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Khuyến mãi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả</SelectItem>
            <SelectItem value="true">Có khuyến mãi</SelectItem>
            <SelectItem value="false">Không có khuyến mãi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-8 shadow-md rounded-lg bg-white mt-8">
        <Table className="w-full h-full">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow>
              <TableHead className="w-[60px] text-center">#</TableHead>
              <TableHead className="w-[200px] text-center">Tên</TableHead>
              <TableHead className="w-[120px] text-center">Giá gốc</TableHead>
              <TableHead className="w-[120px] text-center">Giá cuối</TableHead>
              <TableHead className="w-[100px] text-center">
                Khuyến mãi
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Trạng thái
              </TableHead>
              <TableHead className="w-[160px] text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHeadphones.map((headphone, index) => (
              <TableRow key={headphone._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{headphone.name}</TableCell>
                <TableCell className="text-center">
                  {headphone.startingPrice?.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell className="text-center">
                  {headphone.finalPrice?.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell className="text-center">
                  {headphone.isPromotion ? `${headphone.promotion}%` : "Không"}
                </TableCell>
                <TableCell className="text-center">
                  {headphone.isAvailable ? "Có sẵn" : "Hết hàng"}
                </TableCell>
                <TableCell className="flex gap-2 items-center justify-center">
                  <ViewHeadphoneDetail headphone={headphone}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </div>
                  </ViewHeadphoneDetail>
                  <EditHeadphone headphone={headphone} brands={brands}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-white hover:bg-gray-200 cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </div>
                  </EditHeadphone>
                  <DeleteHeadphone id={headphone._id}>
                    <div className="flex items-center justify-center border rounded-md p-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </DeleteHeadphone>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default HeadphoneTable;
