"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/types/user";
import { apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { error } from "console";

export function BtnChangPassWord({ user }: { user: User }) {
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [showOldPass, setShowOldPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const res = await apiPatch(`/users/change-password/${user._id}`, {
        oldPass,
        newPass,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Thay đổi mật khẩu thành công");
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thay đổi mật khẩu");
    }
  };
  const closeDialog = () => {
    setNewPass("");
    setOldPass("");
    setShowNewPass(false);
    setShowOldPass(false);
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          closeDialog();
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <Button
            className="bg-red-500 hover:bg-red-600 cursor-pointer hover:scale-105"
            onClick={() => setOpen(true)}
          >
            Thay đổi mật khẩu
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thay đổi mật khẩu</DialogTitle>
            <DialogDescription>Thay đổi mật khẩu của bạn</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 relative">
              <Label htmlFor="old-pass">Mật khẩu cũ</Label>
              <Input
                id="old-pass"
                name="old-pass"
                value={oldPass}
                type={showOldPass ? "text" : "password"}
                onChange={(e) => setOldPass(e.target.value)}
              />
              {!showOldPass ? (
                <EyeOff
                  className="absolute top-3/5 right-4 size-5 cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setShowOldPass(true)}
                />
              ) : (
                <Eye
                  className="absolute top-3/5 right-4 size-5 cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setShowOldPass(false)}
                />
              )}
            </div>
            <div className="grid gap-3 relative">
              <Label htmlFor="new-pass">Mật khẩu mới</Label>
              <Input
                id="new-pass"
                name="new-pass"
                value={newPass}
                type={showNewPass ? "text" : "password"}
                onChange={(e) => setNewPass(e.target.value)}
              />
              {!showNewPass ? (
                <EyeOff
                  className="absolute top-3/5 right-4 size-5 cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setShowNewPass(true)}
                />
              ) : (
                <Eye
                  className="absolute top-3/5 right-4 size-5 cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setShowNewPass(false)}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
