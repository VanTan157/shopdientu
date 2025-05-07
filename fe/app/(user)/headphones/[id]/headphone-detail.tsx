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
    <section className="container mx-auto p-5 my-10">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hình ảnh sản phẩm */}
          <div className="relative w-full h-96">
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
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Giá */}
            <div className="mb-4 flex items-center">
              <span className="text-gray-500 line-through text-lg">
                {product.startingPrice.toLocaleString("vi-VN")} ₫
              </span>
              <span className="ml-4 text-red-500 text-2xl font-bold">
                {product.finalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {/* Tình trạng */}
            <p className="mb-4">
              <span className="font-semibold">Tình trạng: </span>
              {product.isAvailable && totalStock > 0 ? (
                <span className="text-green-500">
                  Còn hàng ({totalStock} sản phẩm)
                </span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </p>

            {/* Màu sắc */}
            <div className="mb-4">
              <p className="font-semibold">Màu sắc:</p>
              <div className="flex gap-2 mt-2">
                {product.colorVariants.map((variant, index) => (
                  <div
                    onClick={() => setColorVariant(index)}
                    key={variant._id}
                    className="flex items-center gap-1 border p-2 rounded-md hover:border-blue-500 transition-colors hover:cursor-pointer"
                    style={{
                      borderColor:
                        colorVariant === index ? "#3b82f6" : "#d1d5db",
                    }}
                  >
                    <span>{variant.color}</span>
                    <span className="text-sm text-gray-500">
                      ({variant.stock} còn)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 pt-4">
              <BtnBuyNow product={product} index={colorVariant} />
              <BtnAddToCart product={product} index={colorVariant} />
            </div>
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <hr className="my-6" />
        <div className="mt-6">
          <p className="text-gray-600 mb-4">{product.description}</p>
          <h2 className="text-xl font-semibold mb-2">Thông số kỹ thuật:</h2>
          <ul className="text-gray-700 flex gap-4 justify-between flex-wrap">
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
            <h3 className="text-lg font-semibold mb-2">Thông tin khác:</h3>
            <ul className="text-gray-700 flex flex-col gap-2">
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
