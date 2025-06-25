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

interface DeleteLaptopProps {
  id: string; // ID của điện thoại
  children: React.ReactNode; // Để bọc thẻ div từ MobileFilterTable
}

const DeleteLaptop = ({ id, children }: DeleteLaptopProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleDeleteLaptop = async (laptopId: string) => {
    setLoading(true); // Bắt đầu loading
    const res = await apiDelete(`/laptops/${laptopId}`);

    if (res.data) {
      router.refresh();
      toast.success("Xóa sản phẩm thành công!");
    } else if (res.error) {
      toast.error(res.error);
    } else {
      toast.error("Có lỗi khi xóa sản phẩm!");
    } // Làm mới trang sau khi xóa
    setLoading(false); // Kết thúc loading
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
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  handleDeleteLaptop(id);
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

export default DeleteLaptop;
