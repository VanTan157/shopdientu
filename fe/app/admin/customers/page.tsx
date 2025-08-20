import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { IAllUser } from "@/lib/types/user";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { TableUser } from "./table-user";
import { toast } from "sonner";

const page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<IAllUser[]>("/users", {
    Cookie: `accessToken=${accessToken}`,
  });
  if (res.error) {
    toast.error(res.message);
    return;
  }

  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
          <Plus className="w-5 h-5" />
          Thêm người dùng
        </Button>
      </div>
      <TableUser users={res.data || []} />
    </div>
  );
};

export default page;
