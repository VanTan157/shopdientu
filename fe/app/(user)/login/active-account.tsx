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
      if (res.error) {
        toast.error(res.error);
        stop();
        return;
      }
      toast.success("Chúng tôi đã gửi lại mã xác thực đến email của bạn");
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
      if (res.error) {
        toast.error(res.error);
        stop();
        return;
      }
      toast.success("Chúng tôi đã gửi mã xác thực đến email của bạn");
      setSent(true);
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
    stop();
  };

  const handleVerify = async () => {
    start();
    try {
      const res = await apiPost("/users/verify", {
        email,
        code,
      });
      console.log(res);
      if (res.error) {
        stop();
        toast.error(res.error);
        return;
      }
      toast.success("Kích hoạt tài khoản thành công");
      stop();
      setOpen(false);
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
    stop();
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
