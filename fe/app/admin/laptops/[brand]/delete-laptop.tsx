import { loadingStore } from "@/app/store/loading.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const DeleteLaptop = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { start, stop } = loadingStore();

  const handleDeleteLaptop = async (laptopId: string) => {
    start();
    const res = await apiDelete(`/laptops/${laptopId}`);
    if (res.success) {
      router.refresh();
      toast.success("Xóa sản phẩm thành công!");
    } else {
      toast.error(res.message || "Xóa sản phẩm thất bại!");
    }
    stop();
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bạn có chắc chắn muốn xóa sản phẩm này không?
          </DialogTitle>
          <DialogDescription>
            <span className="text-sm text-gray-500">
              Nếu bạn xóa sản phẩm này, nó sẽ không còn xuất hiện trong danh sản
              phẩm thoại của bạn.
            </span>
            <span className="flex justify-end mt-4">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  handleDeleteLaptop(id);
                }}
              >
                Xóa
              </Button>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLaptop;
