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
import { apiPatch } from "@/lib/api";
import { User } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export function BtnEditProfile({ user }: { user: User }) {
  const [name, setName] = useState<string>(user.name);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const res = await apiPatch<User, {}>(`auth/update-profile`, {
        name,
      });
      if (!res.data) {
        toast.error(res.error);
        return;
      }
      toast.success("Thay đổi tên thành công");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi khi thay đổi tên");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600 cursor-pointer hover:scale-105"
          >
            Thay đổi tên
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Thay đổi tên của bạn</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
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
