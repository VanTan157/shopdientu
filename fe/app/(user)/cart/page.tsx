import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import CartPage from "./cart-page";
import { CartItem } from "@/lib/types/order-item";

const Cart = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<CartItem[]>("/order-items/get-order-not-in-cart", {
    Cookie: `accessToken=${accessToken}`,
  });
  const cartItems = res.data || [];
  return <CartPage carts={cartItems} />;
};

export default Cart;
