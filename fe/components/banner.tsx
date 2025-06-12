"use client";

import { Mobile } from "@/lib/types/mobile";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Banner = ({ hotDeals }: { hotDeals: Mobile[] }) => {
  return (
    <section className="w-full h-96 md:h-[32rem] bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#24243e] rounded-3xl shadow-2xl p-6 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blurred neon circles */}
      <div className="absolute -top-10 -left-10 w-56 h-56 bg-cyan-400 opacity-40 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-fuchsia-500 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent rounded-full blur-2xl z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full z-10"
      >
        {hotDeals.map((deal) => (
          <SwiperSlide key={deal._id}>
            <div className="flex flex-col md:flex-row w-full h-full items-center justify-between transition-all duration-700 ease-in-out">
              <div className="flex-1 flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-400/40 to-fuchsia-500/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}${deal.colorVariants[0]?.image}` ||
                      "/placeholder.jpg"
                    }
                    alt={deal.name}
                    width={340}
                    height={340}
                    quality={100}
                    className="object-contain max-h-80 drop-shadow-[0_8px_32px_rgba(58,255,255,0.25)] rounded-xl transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  {/* Neon border effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/60 group-hover:border-fuchsia-500/80 transition-all duration-500 pointer-events-none animate-neon-glow" />
                </div>
              </div>
              <div className="flex-1 w-full md:w-1/2 h-full flex items-center justify-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl mt-8 md:mt-0 md:ml-10 transition-all duration-500 border border-cyan-400/20">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-300 drop-shadow-lg mb-3 animate-fade-in tracking-tight uppercase neon-text">
                    {deal.name}
                  </h1>
                  <p className="text-lg md:text-2xl mt-3 text-gray-200 font-medium">
                    Giá chỉ từ{" "}
                    <span className="font-bold text-fuchsia-400 text-3xl drop-shadow animate-neon-glow">
                      {deal.finalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                    {deal.promotion > 0 && (
                      <span className="ml-4 inline-block bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white text-base font-semibold px-4 py-1.5 rounded-full shadow-lg animate-bounce border border-white/40">
                        Giảm {deal.promotion}%
                      </span>
                    )}
                  </p>
                  <Link href={`/mobiles/${deal._id}`}>
                    <button className="mt-8 px-10 py-3 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-900 text-white rounded-full font-bold shadow-xl hover:scale-105 hover:from-cyan-500 hover:to-fuchsia-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg animate-neon-glow">
                      Mua ngay
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: linear-gradient(
            135deg,
            #00fff7 60%,
            #ff00cc 100%
          ) !important;
          opacity: 0.7;
          box-shadow: 0 0 8px #00fff7cc, 0 0 16px #ff00cc66;
        }
        .swiper-pagination-bullet-active {
          background: #00fff7 !important;
          box-shadow: 0 0 0 6px #ff00cc33, 0 0 16px #00fff799;
          opacity: 1;
        }
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
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes neon-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 8px #00fff7) drop-shadow(0 0 16px #ff00cc);
          }
          50% {
            filter: drop-shadow(0 0 16px #ff00cc) drop-shadow(0 0 32px #00fff7);
          }
        }
        .animate-neon-glow {
          animation: neon-glow 2s infinite alternate;
        }
        .neon-text {
          text-shadow: 0 0 8px #00fff7, 0 0 16px #ff00cc, 0 0 32px #00fff7;
        }
      `}</style>
    </section>
  );
};

export default Banner;
