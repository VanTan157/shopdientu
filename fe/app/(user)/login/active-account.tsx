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

export default function ActiveAccount({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (isopen: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiPost(`/users/send-code-again`, {
        email,
      });
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      toast.success("Chúng tôi đã gửi mã xác thực đến email của bạn");
      setSent(true);
    } catch (error) {}
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const res = await apiPost("/users/verify", {
      email,
      code,
    });
    console.log(res);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Kích hoạt tài khoản thành công");
    setLoading(false);
    setOpen(false);
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
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <span>Gửi</span>
                  )}
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
                <Button
                  type="button"
                  onClick={handleSendAgain}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <span>Gửi lại mã</span>
                  )}
                </Button>
                <Button type="button" onClick={handleVerify} disabled={loading}>
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <span>Xác nhận</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
