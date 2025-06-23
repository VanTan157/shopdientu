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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteHeadphoneProps {
  id: string; // ID của tai nghe
  children: React.ReactNode; // Để bọc thẻ div từ HeadphoneTable
}

const DeleteHeadphone = ({ id, children }: DeleteHeadphoneProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleDeleteHeadphone = async (headphoneId: string) => {
    setLoading(true); // Bắt đầu loading
    const res = await apiDelete(`/headphones/${headphoneId}`);

    if (res.data) {
      router.refresh();
      toast.success("Xóa tai nghe thành công!");
    } else if (res.error) {
      toast.error(res.error);
    } else {
      toast.error("Có lỗi khi xóa tai nghe!");
    }
    setLoading(false); // Kết thúc loading
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
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  handleDeleteHeadphone(id);
                }}
              >
                {loading && <Loader2 className="animate-spin" />}
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
