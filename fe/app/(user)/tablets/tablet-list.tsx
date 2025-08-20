import { ITablet } from "@/lib/types/tablet";
import Image from "next/image";
import Link from "next/link";

const TabletList = ({ tablets }: { tablets: ITablet[] }) => {
  return (
    <section className="mt-4 xs:mt-6 sm:mt-8">
      <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 pb-2 xs:pb-3 sm:pb-4">
        Máy tính bảng
      </h2>
      <div className="grid grid-cols-3 xs:grid-cols- sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {tablets.map((tablet) => (
          <div
            key={tablet._id}
            className="relative  rounded-lg p-2 xs:p-3 sm:p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-b from-zinc-600 to-zinc-800 text-white"
          >
            <Link href={`/tablets/${tablet._id}`}>
              {tablet.promotion > 0 && (
                <span className="absolute z-1 top-1 xs:top-2 left-1 xs:left-2 bg-red-500 text-white text-[10px] xs:text-xs font-medium px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                  -{tablet.promotion}%
                </span>
              )}
              <div className="relative w-full h-32 xs:h-40 sm:h-48 mb-2 xs:mb-3 sm:mb-4">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${tablet.colorVariants[0]?.image}` ||
                    "/placeholder.jpg"
                  }
                  alt={tablet.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <h3 className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-cyan-300 mb-1 xs:mb-2">
                {tablet.name}
              </h3>
              {tablet.isPromotion ? (
                <div className="mt-1 xs:mt-2">
                  <span className="text-gray-500 line-through text-[10px] xs:text-xs sm:text-sm block">
                    {tablet.startingPrice.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="text-red-500 font-bold text-[10px] xs:text-xs sm:text-sm md:text-base block">
                    {tablet.finalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ) : (
                <div className="mt-1 xs:mt-2 text-red-500 font-bold text-[10px] xs:text-xs sm:text-sm md:text-base">
                  {tablet.finalPrice.toLocaleString("vi-VN")} ₫
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TabletList;
