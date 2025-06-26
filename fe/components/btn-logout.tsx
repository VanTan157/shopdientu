"use client";

import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BtnLogout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const res = await apiPost(`/auth/logout`, {});
    if (res.data) {
      toast.success("Đăng xuất thành công");
      router.push("/");
      router.refresh();
    }
    if (res.error) {
      toast.success("Có lỗi xảy ra khi đăng xuất");
      router.push("/");
      router.refresh();
    }
  };
  return <div onClick={handleLogout}>Đăng xuất</div>;
};

export default BtnLogout;
