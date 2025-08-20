"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { loadingStore } from "@/app/store/loading.store";

export default function ActiveAccount({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (isopen: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const { start, stop } = loadingStore();
  const [code, setCode] = useState<string>("");

  const handleSendAgain = async () => {
    start();
    try {
      const res = await apiPost("/users/send-code-again", {
        email,
      });
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
    stop();
  };

  const handleSubmit = async () => {
    start();
    try {
      const res = await apiPost(`/users/send-code-again`, {
        email,
      });
      if (res.success) {
        setSent(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      stop();
    }
  };

  const handleVerify = async () => {
    start();
    try {
      const res = await apiPost("/users/verify", {
        email,
        code,
      });
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      stop();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="transition-all duration-500">
          <DialogHeader>
            <DialogTitle>
              {!sent ? "Kích hoạt tài khoản" : "Nhập mã xác thực"}
            </DialogTitle>
          </DialogHeader>
          {!sent ? (
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <DialogFooter>
                <Button type="button" onClick={handleSubmit}>
                  Gửi
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Nhập mã xác thực"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
              />
              <DialogFooter>
                <Button type="button" onClick={handleSendAgain}>
                  Gửi lại mã
                </Button>
                <Button type="button" onClick={handleVerify}>
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
