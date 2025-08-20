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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EUserType, IAllUser } from "@/lib/types/user";
import { useState } from "react";
import { apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loadingStore } from "@/app/store/loading.store";

export function EditUser({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IAllUser;
}) {
  const [userEdit, setUserEdit] = useState<IAllUser>(user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { start, stop } = loadingStore();

  const handleSubmit = async () => {
    start();
    const res = await apiPatch<IAllUser, IAllUser>(
      `/users/${user._id}`,
      userEdit
    );
    if (res.error) {
      toast.error(res.message);
      return;
    }
    toast.success("Cập nhật người dùng thành công");
    router.refresh();
    setIsOpen(false);
    stop();
  };

  const handCancel = () => {
    setUserEdit(user);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] w-full !max-w-[60%] !min-w-fit">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={userEdit.name}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={userEdit.email}
                onChange={(e) =>
                  setUserEdit({ ...userEdit, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Type</Label>
              <Select
                value={userEdit.type}
                onValueChange={(value) =>
                  setUserEdit({ ...userEdit, type: value as IAllUser["type"] })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={EUserType.USER}>
                      {EUserType.USER}
                    </SelectItem>
                    <SelectItem value={EUserType.ADMIN}>
                      {EUserType.ADMIN}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white"
              onClick={handleSubmit}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
