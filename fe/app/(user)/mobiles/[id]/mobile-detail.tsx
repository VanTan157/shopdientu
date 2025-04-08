"use client";
import { Mobile } from "@/lib/validate/mobile";
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
            <div className="mb-4">
              <span className="text-gray-500 line-through text-lg">
                {product.StartingPrice.toLocaleString("vi-VN")} ₫
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
            <div className="flex gap-4">
              <BtnBuyNow product={product} index={colorVariant} />
              <BtnAddToCart product={product} index={colorVariant} />
            </div>
          </div>
        </div>
        {/* Thông số kỹ thuật */}
        <div>
          <div className="mt-6">
            <p className="text-gray-600 mb-4">{product.description}</p>
            <h2 className="text-xl font-semibold mb-2">Thông số kỹ thuật</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Màn hình:</strong> {product.specifications.screenSize}"
                ({product.specifications.resolution})
              </li>
              <li>
                <strong>CPU:</strong> {product.specifications.cpu}
              </li>
              <li>
                <strong>RAM:</strong> {product.specifications.ram}GB
              </li>
              <li>
                <strong>Bộ nhớ:</strong> {product.specifications.storage}GB
              </li>
              <li>
                <strong>Pin:</strong> {product.specifications.battery}mAh
              </li>
              <li>
                <strong>Hệ điều hành:</strong> {product.specifications.os}
              </li>
              <li>
                <strong>Camera sau:</strong> {product.camera.rear}
              </li>
              <li>
                <strong>Camera trước:</strong> {product.camera.front}
              </li>
              <li>
                <strong>Trọng lượng:</strong> {product.weight}g
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDetail;
