"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/types/user";
import { useState } from "react";
import { EditUser } from "./edit-customer";

export function TableUser({ users }: { users: User[] }) {
  const [userSearch, setUserSearch] = useState<string>();
  const [userSelected, setUserSelected] = useState<string>("tatca");
  console.log(users);

  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có người dùng nào.</div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(userSearch?.toLowerCase() || "");
    const matchesType =
      userSelected === "tatca" || user.type === userSelected.toUpperCase();
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={userSearch || ""}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <Select value={userSelected} onValueChange={setUserSelected}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="tatca">Tất cả</SelectItem>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table className="mt-4">
        <TableHeader className="bg-gray-100 text-gray-700">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user._id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell className="flex gap-2">
                <EditUser user={user}>
                  <Button className="text-white hover:bg-blue-700 cursor-pointer bg-blue-600">
                    Edit
                  </Button>
                </EditUser>
                <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  Delete
                </Button>
              </TableCell>
              s
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
