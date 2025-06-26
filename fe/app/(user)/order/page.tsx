import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import OrderPage from "./order-page";
import { Order } from "@/lib/types/order";

const Cart = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<Order[]>("/order/find-by-user", {
    Cookie: `accessToken=${accessToken}`,
  });
  const orders = res.data || [];
  return <OrderPage orders={orders} />;
};

export default Cart;
