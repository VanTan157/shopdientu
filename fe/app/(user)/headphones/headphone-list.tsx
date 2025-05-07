import { Headphone } from "@/lib/types/headphone";
import Image from "next/image";
import Link from "next/link";

const HeadphoneList = ({ headphones }: { headphones: Headphone[] }) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Danh sách headphone</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {headphones.map((headphone) => (
          <div
            key={headphone._id}
            className="relative border rounded-lg p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Link href={`/headphones/${headphone._id}`}>
              {/* Phần trăm khuyến mãi ở góc trên bên trái */}
              {headphone.promotion > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  -{headphone.promotion}%
                </span>
              )}
              {/* Hình ảnh */}
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${headphone.colorVariants[0]?.image}` ||
                    "/placeholder.jpg"
                  }
                  alt={headphone.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              {/* Thông tin sản phẩm */}
              <h3 className="text-lg font-semibold">{headphone.name}</h3>
              <p className="text-sm text-gray-600">
                {headphone.brand} - {headphone.type}
              </p>
              {headphone.isPromotion ? (
                <div className="mt-2">
                  <span className="text-gray-500 line-through">
                    {headphone.startingPrice.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="ml-2 text-red-500 font-bold">
                    {headphone.finalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-red-500 font-bold">
                  {headphone.finalPrice.toLocaleString("vi-VN")} ₫
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeadphoneList;
