// components/MobileList.tsx
import { Mobile } from "@/lib/types/mobile";
import Image from "next/image";
import Link from "next/link";

const MobileList = ({ mobiles }: { mobiles: Mobile[] }) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 pb-4">
        Danh sách điện thoại
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mobiles.map((mobile) => (
          <div
            key={mobile._id}
            className="relative border rounded-lg p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-b from-zinc-600 to-zinc-800 text-white "
          >
            <Link href={`/mobiles/${mobile._id}`}>
              {/* Phần trăm khuyến mãi ở góc trên bên trái */}
              {mobile.promotion > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  -{mobile.promotion}%
                </span>
              )}
              {/* Hình ảnh */}
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${mobile.colorVariants[0]?.image}` ||
                    "/placeholder.jpg"
                  }
                  alt={mobile.name}
                  fill
                  className="object-contain rounded-md "
                />
              </div>
              {/* Thông tin sản phẩm */}
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                {mobile.name}
              </h3>
              {mobile.IsPromotion ? (
                <div className="mt-2">
                  <span className="text-gray-500 line-through">
                    {mobile.StartingPrice.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="ml-2 text-red-500 font-bold">
                    {mobile.finalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-red-500 font-bold">
                  {mobile.finalPrice.toLocaleString("vi-VN")} ₫
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileList;
