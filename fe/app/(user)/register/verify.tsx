"user client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
}

export function Verify({ open, setOpen, email }: VerifyProps) {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSendAgain = async () => {
    setLoading(true);
    const res = await apiPost("/users/send-code-again", {
      email,
    });
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Chúng tôi đã gửi lại mã xác thực đến email của bạn");
    setLoading(false);
  };

  const onSubmit = async () => {
    setLoading(true);
    const res = await apiPost("/users/verify", {
      email,
      code,
    });
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Kích hoạt tài khoản thành công");
    setLoading(false);
    setOpen(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác minh tài khoản</DialogTitle>
            <DialogDescription>
              Vui lòng nhập mã xác minh được gửi đến email của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="code">Mã xác minh</Label>
              <Input
                id="code"
                placeholder="Nhập mã xác minh"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Hủy
              </Button>
            </DialogClose>
            <Button onClick={handleSendAgain} disabled={loading}>
              Gửi lại mã
            </Button>
            <Button type="submit" onClick={onSubmit} disabled={loading}>
              Xác minh
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
