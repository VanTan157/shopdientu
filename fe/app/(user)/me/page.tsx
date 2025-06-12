import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import { User } from "@/lib/types/user";
import BtnEditProfile from "./btn-edit-profile";
import BtnChangPassWord from "./btn-change-password";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProfilePage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  console.log("accessToken", accessToken);

  const res = await apiGet<User>("/auth/get-me", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log(res);

  if (!res.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 font-medium">
          Đang tải hoặc không tìm thấy thông tin...
        </p>
      </div>
    );
  }

  const user = res.data;
  console.log("check", user);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Hồ sơ người dùng
        </h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="font-semibold text-gray-700 w-1/3">Email:</span>
            <span className="text-gray-900 w-2/3">{user.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="font-semibold text-gray-700 w-1/3">Tên:</span>
            <span className="text-gray-900 w-2/3">{user.name}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="font-semibold text-gray-700 w-1/3">
              Loại tài khoản:
            </span>
            <span className="text-gray-900 w-2/3">
              {user.type === "ADMIN" ? "Quản trị viên" : "Người dùng"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          {user.type === "ADMIN" && (
            <Link href="/admin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Trang quản lý
              </Button>
            </Link>
          )}
          <BtnEditProfile />
          <BtnChangPassWord />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
