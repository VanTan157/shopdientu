// components/Banner.tsx
"use client";

import { Mobile } from "@/lib/validate/mobile";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Banner = ({ hotDeals }: { hotDeals: Mobile[] }) => {
  return (
    <section className="w-full h-96 bg-gray-50 rounded-xl shadow-xl p-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {hotDeals.map((deal) => (
          <SwiperSlide key={deal._id}>
            {/* Hình ảnh */}
            <div className="flex w-full h-full items-center justify-between">
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}${deal.colorVariants[0]?.image}` ||
                  "/placeholder.jpg"
                }
                alt={deal.name}
                width={380}
                height={380}
                quality={100}
                className="object-contain max-h-full"
              />
              <div className="flex-1 w-1/2 h-full flex items-center justify-center text-black bg-opacity-40 p-6 rounded-r-lg">
                <div className="text-center">
                  <h1 className="text-4xl font-bold">{deal.name}</h1>
                  <p className="text-xl mt-2">
                    Giá chỉ từ{" "}
                    <span className="font-semibold text-yellow-300">
                      {deal.finalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                    {deal.promotion > 0 && (
                      <span className="ml-4 inline-block bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                        Giảm {deal.promotion}%
                      </span>
                    )}
                  </p>
                  <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    <Link href={`/mobiles/${deal._id}`}>Mua ngay</Link>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
