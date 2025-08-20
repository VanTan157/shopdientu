"use client";

import { useCartStore } from "@/app/store/cart-store";
import { apiGet } from "@/lib/api";
import { IOrderItem } from "@/lib/types/order-item";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

const CartIcon = () => {
  const { setCartItemCount, cartItemCount } = useCartStore();
  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const res = await apiGet<IOrderItem[]>(
          "/order-items/get-order-item-not-in-order",
          undefined,
          ["carts"],
          true
        );
        console.log("Fetched cart items:", res.data);
        if (res.success && res.data) {
          setCartItemCount(res.data.length);
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };
    fetchCartItem();
  }, [setCartItemCount]);

  return (
    <div>
      <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white group-hover:text-blue-400 transition" />
      {cartItemCount > 0 && (
        <span className="absolute -top-3 -right-3 bg-red-600 w-5 h-5 flex justify-center items-center rounded-full ">
          {cartItemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
