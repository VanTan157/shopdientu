"use client";

import { useCartStore } from "@/app/store/cart-store";
import { apiGet } from "@/lib/api";
import { CartItem } from "@/lib/types/order-item";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CartIcon = () => {
  const { cartItemCount, setCartItemCount } = useCartStore();
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const res = await apiGet<CartItem[]>(
          "/order-items/get-order-not-in-cart"
        );
        if (!res || !res.data) {
          console.error("No data received from API");
          return;
        }
        setCartItemCount(res.data.length);
        console.log(cartItemCount, "cartItemCount");
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };
    fetchCartItemCount();
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
