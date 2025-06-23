import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { User } from "@/lib/types/user";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { TableUser } from "./table-user";

const page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<User>("/users", {
    Cookie: `accessToken=${accessToken}`,
  });

  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
          <Plus className="w-5 h-5" />
          Thêm người dùng
        </Button>
      </div>
      <TableUser users={Array.isArray(res.data) ? res.data : []} />
    </div>
  );
};

export default page;
