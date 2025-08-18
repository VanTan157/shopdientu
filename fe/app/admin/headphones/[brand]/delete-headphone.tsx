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

const DeleteHeadphone = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { start, stop } = loadingStore();

  const handleDeleteHeadphone = async (headphoneId: string) => {
    start();
    const res = await apiDelete(`/headphones/${headphoneId}`);

    if (res.data) {
      router.refresh();
      toast.success("Xóa tai nghe thành công!");
    } else if (res.error) {
      toast.error(res.error);
    } else {
      toast.error("Có lỗi khi xóa tai nghe!");
    }
    stop();
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bạn có chắc chắn muốn xóa tai nghe này không?
          </DialogTitle>
          <DialogDescription>
            <span className="text-sm text-gray-500">
              Nếu bạn xóa tai nghe này, nó sẽ không còn xuất hiện trong danh
              sách sản phẩm của bạn.
            </span>
            <span className="flex justify-end mt-4">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  handleDeleteHeadphone(id);
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

export default DeleteHeadphone;
