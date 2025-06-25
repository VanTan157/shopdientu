"use client";

import { apiGet } from "@/lib/api";
import { MobileType } from "@/lib/types/mobile";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const MobileHeader = () => {
  const [mobileTypes, setMobileTypes] = useState<MobileType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchMobileTypes = async () => {
      const res = await apiGet<MobileType[]>("/mobile-types");
      setMobileTypes(res.data || []);
    };
    fetchMobileTypes();
  }, []);

  return (
    <div
      className="fixed top-22 left-0 z-50"
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <div onMouseEnter={() => setIsOpen(true)}>
        <Button
          variant="outline"
          size="icon"
          className="m-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl border-0 transition-all duration-200 ring-2 ring-blue-300 hover:ring-purple-400"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div
          className="absolute top-5 h-[50vh] left-16 min-w-60 w max-w-[80vw] p-6 bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in"
          onMouseEnter={() => setIsOpen(true)}
        >
          <h2 className="text-xl font-bold mb-5 text-blue-700 flex items-center gap-2">
            <Menu className="h-5 w-5 text-blue-500" />
            Danh mục
          </h2>
          <nav className="grid grid-rows-4 grid-flow-col gap-3 max-h-[calc(50vh-8rem)]">
            {mobileTypes.map((type) => (
              <Link
                key={type._id}
                href={`/mobiles/type/${type._id}`}
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 hover:scale-[1.03] transition-all duration-150 text-base font-medium text-gray-800 shadow-sm hover:shadow-md"
                onClick={() => setIsOpen(false)}
              >
                {type.type}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default MobileHeader;
