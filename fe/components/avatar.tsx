import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { User } from "lucide-react";
import BtnLogout from "./btn-logout";
import Link from "next/link";

const Avatar = () => {
  return (
    <HoverCard openDelay={0} closeDelay={50}>
      <HoverCardTrigger className="flex items-center space-x-1 cursor-pointer">
        <div className="rounded-full p-2 bg-white text-black hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-40 bg-white border border-gray-200 shadow-lg p-0">
        <div className="flex flex-col">
          <div className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors">
            Hồ sơ
          </div>{" "}
          <Link href={"/order"}>
            <div className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors">
              Đơn mua
            </div>
          </Link>
          <div className="px-4 py-2 hover:bg-red-50 text-gray-800 cursor-pointer transition-colors">
            <BtnLogout />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Avatar;
