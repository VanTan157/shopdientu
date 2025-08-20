"use client";

import { loadingStore } from "@/app/store/loading.store";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BtnLogout = () => {
  const router = useRouter();
  const { start, stop } = loadingStore();
  const handleLogout = async () => {
    start();
    const res = await apiPost(`/auth/logout`, {});
    if (res.success) {
      toast.success(res.message);
      router.push("/");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    stop();
  };
  return <div onClick={handleLogout}>Đăng xuất</div>;
};

export default BtnLogout;
