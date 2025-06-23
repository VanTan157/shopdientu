"use client";

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
      <HoverCardTrigger className="flex items-center space-x-2 cursor-pointer group">
        <div className="rounded-full p-2 bg-gradient-to-tr from-green-400 via-blue-500 to-purple-500 text-white shadow-lg transition-all duration-200 ease-in-out group-hover:scale-110 group-active:scale-95 border-2 border-white">
          <User className="w-6 h-6" />
        </div>
        <span className="hidden md:inline-block text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
          Tài khoản
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 bg-white/90 backdrop-blur border border-gray-200 shadow-2xl rounded-xl p-0 overflow-hidden animate-fade-in">
        <div className="flex flex-col text-sm font-medium divide-y divide-gray-100">
          <Link href={"/me"}>
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-150 ease-in-out">
              <User className="w-4 h-4 opacity-70" />
              Hồ sơ
            </div>
          </Link>
          <Link href={"/order"}>
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-green-50 text-gray-700 hover:text-green-600 cursor-pointer transition-all duration-150 ease-in-out">
              <svg
                className="w-4 h-4 opacity-70"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
              </svg>
              Đơn mua
            </div>
          </Link>
          <div className="flex items-center gap-2 px-5 py-3 hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition-all duration-150 ease-in-out">
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            <BtnLogout />
          </div>
        </div>
      </HoverCardContent>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </HoverCard>
  );
};

export default Avatar;
