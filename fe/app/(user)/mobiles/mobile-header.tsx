// components/MobileHeader.tsx
"use client";

import { apiGet } from "@/lib/api";
import { MobileType } from "@/lib/types/mobile";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Từ shadcn/ui
import { Menu } from "lucide-react";

const MobileHeader = () => {
  const [mobileTypes, setMobileTypes] = useState<MobileType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchMobileTypes = async () => {
      const res = await apiGet<MobileType[]>("/mobile-types");
      setMobileTypes(res.data || []);
    };
    fetchMobileTypes();
  }, []);

  return (
    <div
      className="fixed top-20 left-0 z-40"
      onMouseLeave={() => setIsOpen(false)} // Ẩn khi chuột rời khỏi toàn bộ khu vực
    >
      {/* Nút trigger */}
      <div onMouseEnter={() => setIsOpen(true)}>
        <Button variant="outline" size="icon" className="m-4">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Nội dung sidebar */}
      {isOpen && (
        <div
          className="absolute top-14 left-4 w-48 p-4 bg-gray-50 text-gray-800 rounded-md shadow-md transition-opacity duration-200"
          onMouseEnter={() => setIsOpen(true)} // Giữ mở khi hover vào sidebar
        >
          <h2 className="text-lg font-semibold mb-4">Danh mục</h2>
          <nav className="space-y-2">
            {mobileTypes.map((type) => (
              <Link
                key={type._id}
                href={`/mobiles/type/${type._id}`}
                className="block py-1.5 px-3 rounded-md hover:bg-gray-200 transition-colors text-base"
                onClick={() => setIsOpen(false)} // Đóng sidebar khi click vào link
              >
                {type.type}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
