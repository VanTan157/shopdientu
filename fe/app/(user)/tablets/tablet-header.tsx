// components/MobileHeader.tsx
"use client";

import { apiGet } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Từ shadcn/ui
import { Menu } from "lucide-react";

const TabletHeader = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchHeadphoneBrands = async () => {
      const res = await apiGet("/tablets/get-all-brand");
      const data: string[] = Array.isArray(res.data) ? res.data : [];
      setBrands(data);
    };
    fetchHeadphoneBrands();
  }, []);

  return (
    <div
      className="fixed top-22 left-0 z-50"
      onMouseLeave={() => setIsOpen(false)} // Ẩn khi chuột rời khỏi toàn bộ khu vực
    >
      {/* Nút trigger */}
      <div onMouseEnter={() => setIsOpen(true)}>
        <Button
          variant="outline"
          size="icon"
          className="m-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl border-0 transition-all duration-200 ring-2 ring-blue-300 hover:ring-purple-400"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Nội dung sidebar */}
      {isOpen && (
        <div
          className="absolute top-16 left-6 min-w-60 max-w-[80vw] p-6 bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in"
          onMouseEnter={() => setIsOpen(true)} // Giữ mở khi hover vào sidebar
        >
          <h2 className="text-xl font-bold mb-5 text-blue-700 flex items-center gap-2">
            <Menu className="h-5 w-5 text-blue-500" />
            Danh mục
          </h2>
          <nav className="grid grid-rows-4 grid-flow-col gap-3 max-h-[calc(50vh-8rem)]">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={`/tablets/brand/${brand}`}
                className="block py-2 px-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 hover:scale-[1.03] transition-all duration-150 text-base font-medium text-gray-800 shadow-sm hover:shadow-md"
                onClick={() => setIsOpen(false)} // Đóng sidebar khi click vào link
              >
                {brand}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default TabletHeader;
