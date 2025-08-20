"use client";

import Image from "next/image";
import { useState } from "react";
import BtnBuyNow from "./btn-buy-now";
import BtnAddToCart from "./btn-add-cart";
import { IMobile } from "@/lib/types/mobile";

const MobileDetail = ({ product }: { product: IMobile }) => {
  const [colorVariant, setColorVariant] = useState(0);
  const totalStock = product.colorVariants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 my-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        <div className="relative w-full h-64 sm:h-80 lg:h-[32rem] rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <Image
            src={
              `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.colorVariants[colorVariant]?.image}` ||
              "/placeholder.jpg"
            }
            alt={product.name}
            fill
            quality={100}
            className="object-contain rounded-xl"
          />
          {product.promotion > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm sm:text-base font-semibold px-3 py-1.5 rounded-full shadow-md">
              Giảm {product.promotion}%
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-300 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 line-through text-sm sm:text-lg">
              {product.startingPrice.toLocaleString("vi-VN")} ₫
            </span>
            <span className="text-red-400 text-lg sm:text-2xl font-bold">
              {product.finalPrice.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <p className="text-sm sm:text-base">
            <span className="font-semibold text-white">Tình trạng: </span>
            {product.isAvailable && totalStock > 0 ? (
              <span className="text-green-400">
                Còn hàng ({totalStock} sản phẩm)
              </span>
            ) : (
              <span className="text-red-400">Hết hàng</span>
            )}
          </p>

          <div>
            <p className="font-semibold text-lg sm:text-xl text-white mb-3">
              Màu sắc:
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colorVariants.map((variant, index) => (
                <button
                  type="button"
                  onClick={() => setColorVariant(index)}
                  key={variant._id}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-lg border-2 transition-all duration-200 w-28 sm:w-32
                    ${
                      colorVariant === index
                        ? "border-cyan-400 bg-cyan-900/30 text-cyan-200 shadow-lg"
                        : "border-gray-600 bg-gray-700/50 text-gray-200 hover:border-cyan-500 hover:bg-cyan-900/20"
                    }`}
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {variant.color}
                  </span>
                  <span className="text-xs text-gray-300">
                    ({variant.stock} còn)
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <BtnBuyNow product={product} index={colorVariant} />
            <BtnAddToCart product={product} index={colorVariant} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-gray-200 mb-8 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
          {product.description}
        </p>
        <hr className="border-gray-700 my-8" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 uppercase mb-6">
          Thông số kỹ thuật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-200 text-sm sm:text-base">
          <div className="flex flex-col gap-3">
            <p>
              <strong className="text-cyan-300">Màn hình:</strong>{" "}
              {product.specifications.screenSize}"
            </p>
            <p>
              <strong className="text-cyan-300">RAM:</strong>{" "}
              {product.specifications.ram}GB
            </p>
            <p>
              <strong className="text-cyan-300">Trọng lượng:</strong>{" "}
              {product.dimensions.weight}g
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p>
              <strong className="text-cyan-300">Hệ điều hành:</strong>{" "}
              {product.specifications.os}
            </p>
            <p>
              <strong className="text-cyan-300">Camera sau:</strong>{" "}
              {product.specifications.camera.rear}
            </p>
            <p>
              <strong className="text-cyan-300">Camera trước:</strong>{" "}
              {product.specifications.camera.front}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p>
              <strong className="text-cyan-300">Bộ nhớ:</strong>{" "}
              {product.specifications.storage}GB
            </p>
            <p>
              <strong className="text-cyan-300">Pin:</strong>{" "}
              {product.specifications.battery}mAh
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDetail;
