import { CartItemMobile } from "@/lib/types/order-item";
import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import CartPage from "./cart-page";

const Cart = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  console.log("accessToken", accessToken);
  const res = await apiGet<CartItemMobile[]>(
    "/order-items/get-order-not-in-cart",
    {
      Cookie: `accessToken=${accessToken}`,
    }
  );
  console.log(res);
  const cartItems = res.data || [];
  console.log("check", cartItems);
  return <CartPage carts={cartItems} />;
};

export default Cart;
