import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import CartPage from "./cart-page";
import { toast } from "sonner";
import { IOrderItem } from "@/lib/types/order-item";

const Cart = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<IOrderItem[]>(
    "/order-items/get-order-item-not-in-order",
    {
      Cookie: `accessToken=${accessToken}`,
    }
  );
  if (res.error) {
    toast.error(res.message);
    return <div>Error fetching cart items</div>;
  }
  console.log("Cart items:", res.data);
  const cartItems = res.data || [];
  return <CartPage carts={cartItems} />;
};

export default Cart;
