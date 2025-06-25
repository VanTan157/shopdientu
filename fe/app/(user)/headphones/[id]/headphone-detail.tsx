"use client";
import Image from "next/image";
import { useState } from "react";
import BtnBuyNow from "./btn-buy-now";
import BtnAddToCart from "./btn-add-cart";
import { Headphone } from "@/lib/types/headphone";

const HeadphoneDetail = ({ product }: { product: Headphone }) => {
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
            <h1 className="text-xl md:text-4xl font-bold mb-4 text-cyan-300">
              {product.name}
            </h1>

            {/* Giá */}
            <div className="mb-4 flex items-center">
              <span className="text-gray-500 line-through text-xs md:text-lg">
                {product.startingPrice.toLocaleString("vi-VN")} ₫
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
                  <div
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
                    <span className="text-xs md:text-base">
                      {variant.color}
                    </span>
                    <span className="text-xs md:text-sm text-white">
                      ({variant.stock} còn)
                    </span>
                  </div>
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
        <div className="mt-6">
          <p className="text-white mb-4 whitespace-pre-wrap text-sm md:text-base">
            {product.description}
          </p>
          <hr className="my-6" />
          <h2 className="text-2xl font-semibold mb-2 text-indigo-400 uppercase pt-4">
            Thông số kỹ thuật:
          </h2>
          <ul className="text-white list-none grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
            <div className="flex flex-col gap-2">
              <li>
                <strong>Loại driver:</strong>{" "}
                {product.specifications.driverType}
              </li>
              <li>
                <strong>Kích thước driver:</strong>{" "}
                {product.specifications.driverSize}mm
              </li>
              <li>
                <strong>Dải tần số:</strong>{" "}
                {product.specifications.frequencyRange}Hz
              </li>
              <li>
                <strong>Độ nhạy:</strong> {product.specifications.sensitivity}dB
              </li>
              <li>
                <strong>Trở kháng:</strong> {product.specifications.impedance}Ω
              </li>
              <li>
                <strong>Chống ồn:</strong>{" "}
                {product.specifications.noiseCancellation}
              </li>
            </div>
            <div className="flex flex-col gap-2">
              <li>
                <strong>Thời lượng pin:</strong>{" "}
                {product.specifications.batteryLife} giờ
              </li>
              <li>
                <strong>Thời gian sạc:</strong>{" "}
                {product.specifications.chargingTime} giờ
              </li>
              <li>
                <strong>Cổng sạc:</strong> {product.specifications.chargingPort}
              </li>
              <li>
                <strong>Microphone:</strong> {product.specifications.microphone}
              </li>
              <li>
                <strong>Chất lượng âm thanh:</strong>{" "}
                {product.specifications.audioQuality}
              </li>
              <li>
                <strong>Trọng lượng:</strong> {product.weight}g
              </li>
            </div>
            <div className="flex flex-col gap-2">
              <li>
                <strong>Kích thước:</strong> {product.dimensions.length} x{" "}
                {product.dimensions.width} x {product.dimensions.height} cm
              </li>
            </div>
          </ul>

          {/* Thông tin bổ sung */}
          <hr className="my-6" />
          <div className="mt-4">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-400 uppercase pt-4">
              Thông tin khác:
            </h3>
            <ul className="text-white list-none grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
              <li>
                <strong>Phụ kiện:</strong> {product.accessories.join(", ")}
              </li>
              <li>
                <strong>Thương hiệu:</strong> {product.brand}
              </li>
              <li>
                <strong>Loại tai nghe:</strong> {product.type}
              </li>
              <li>
                <strong>Kết nối:</strong> {product.connectivity.join(", ")}
              </li>
              <li>
                <strong>Bảo hành:</strong> {product.warranty}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadphoneDetail;
