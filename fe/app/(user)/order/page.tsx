import { apiGet } from "@/lib/api";
import { OrderMobile } from "@/lib/validate/order";
import { cookies } from "next/headers";
import OrderPage from "./order-page";

const Cart = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  console.log("accessToken", accessToken);
  const res = await apiGet<OrderMobile[]>("/order/find-by-user", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log(res);
  const orders = res.data || [];
  return <OrderPage orders={orders} />;
};

export default Cart;
