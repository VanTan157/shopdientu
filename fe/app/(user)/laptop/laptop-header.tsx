// components/MobileHeader.tsx
"use client";

import { apiGet } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Từ shadcn/ui
import { Menu } from "lucide-react";

const LaptopHeader = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchMobileTypes = async () => {
      const res = await apiGet("/laptops/get-all-brand");
      const data: string[] = Array.isArray(res.data) ? res.data : [];
      console.log(data);
      setBrands(data);
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
        <Button
          variant="outline"
          size="icon"
          className="m-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 hover:shadow-xl"
        >
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
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={`/laptop/brand/${brand}`}
                className="block py-1.5 px-3 rounded-md hover:bg-gray-200 transition-colors text-base"
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

export default LaptopHeader;
