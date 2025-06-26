"use client";
import { Mobile } from "@/lib/types/mobile";
import Image from "next/image";
import { useState } from "react";
import BtnBuyNow from "./btn-buy-now";
import BtnAddToCart from "./btn-add-cart";
const MobileDetail = ({ product }: { product: Mobile }) => {
  const [colorVariant, setColorVariant] = useState(0);
  const totalStock = product.colorVariants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );

  return (
    <section className="container mx-auto p-5 my-10 rounded-lg shadow-lg">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hình ảnh sản phẩm */}
          <div className="relative w-full h-40 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.colorVariants[colorVariant]?.image}` ||
                "/placeholder.jpg"
              }
              alt={product.name}
              fill
              quality={100}
              className="object-contain rounded-lg shadow-md"
            />
            {product.promotion > 0 && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                Giảm {product.promotion}%
              </span>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div>
            <h1 className="md:text-4xl text-xl font-bold mb-4 text-cyan-300">
              {product.name}
            </h1>

            {/* Giá */}
            <div className="mb-4">
              <span className="text-gray-500 line-through text-xs md:text-lg">
                {product.StartingPrice.toLocaleString("vi-VN")} ₫
              </span>
              <span className="ml-4 text-red-500 text-base md:text-2xl font-bold">
                {product.finalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {/* Tình trạng */}
            <p className="mb-4">
              <span className="font-semibold text-base md:text-xl">
                Tình trạng:{" "}
              </span>
              {product.isAvailable && totalStock > 0 ? (
                <span className="text-green-500 text-xs md:text-lg">
                  Còn hàng ({totalStock} sản phẩm)
                </span>
              ) : (
                <span className="text-red-500 text-xs md:text-lg">
                  Hết hàng
                </span>
              )}
            </p>

            {/* Màu sắc */}
            <div className="mb-4">
              <p className="font-semibold text-base md:text-xl">Màu sắc:</p>
              <div className="flex gap-2 mt-2">
                {product.colorVariants.map((variant, index) => (
                  <button
                    type="button"
                    onClick={() => setColorVariant(index)}
                    key={variant._id}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors duration-200
                      ${
                        colorVariant === index
                          ? "border-blue-500 bg-blue-900 text-cyan-300 shadow-lg"
                          : "border-gray-400 bg-gray-800 text-white hover:border-blue-400"
                      }
                      focus:outline-none`}
                  >
                    <span className="font-semibold text-xs md:text-base">
                      {variant.color}
                    </span>
                    <span className="text-xs md:text-sm text-white">
                      ({variant.stock} còn)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="md:flex gap-4 pt-4 space-y-2">
              <BtnBuyNow product={product} index={colorVariant} />
              <BtnAddToCart product={product} index={colorVariant} />
            </div>
          </div>
        </div>
        {/* Thông số kỹ thuật */}

        <div>
          <div className="mt-6">
            <p className="text-white mb-4 whitespace-pre-wrap text-sm md:text-base">
              {product.description}
            </p>
            <hr className="my-8" />
            <h2 className="text-2xl font-semibold mb-2 text-indigo-400 uppercase pt-4">
              Thông số kỹ thuật
            </h2>
            <ul className=" text-white list-none grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm md:text-base">
              <div className="flex flex-col gap-2">
                <li>
                  <strong>Màn hình:</strong> {product.specifications.screenSize}
                  ({product.specifications.resolution})
                </li>
                <li>
                  <strong>CPU:</strong> {product.specifications.cpu}
                </li>
                <li>
                  <strong>RAM:</strong> {product.specifications.ram}GB
                </li>
              </div>
              <div className="flex flex-col gap-2">
                <li>
                  <strong>Hệ điều hành:</strong> {product.specifications.os}
                </li>
                <li>
                  <strong>Camera sau:</strong> {product.camera.rear}
                </li>
                <li>
                  <strong>Camera trước:</strong> {product.camera.front}
                </li>
              </div>
              <div className="flex flex-col gap-2">
                <li>
                  <strong>Bộ nhớ:</strong> {product.specifications.storage}GB
                </li>
                <li>
                  <strong>Pin:</strong> {product.specifications.battery}mAh
                </li>
                <li>
                  <strong>Trọng lượng:</strong> {product.weight}g
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDetail;
