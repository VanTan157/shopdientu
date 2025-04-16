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
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger className="flex items-center space-x-1 cursor-pointer">
        <div className="rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95">
          <User className="w-5 h-5" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-44 bg-white border border-gray-200 shadow-xl rounded-lg p-0 overflow-hidden">
        <div className="flex flex-col text-sm font-medium">
          <Link href={"/me"}>
            <div className="px-4 py-2.5 hover:bg-green-50 text-gray-700 hover:text-green-600 cursor-pointer transition-all duration-150 ease-in-out">
              Hồ sơ
            </div>
          </Link>
          <Link href={"/order"}>
            <div className="px-4 py-2.5 hover:bg-green-50 text-gray-700 hover:text-green-600 cursor-pointer transition-all duration-150 ease-in-out">
              Đơn mua
            </div>
          </Link>
          <div className="px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition-all duration-150 ease-in-out">
            <BtnLogout />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Avatar;
