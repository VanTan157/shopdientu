import { apiGet } from "@/lib/api";
import { OrderMobile } from "@/lib/types/order";
import { cookies } from "next/headers";
import OrderTable from "./order-table";
const Page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<OrderMobile[]>("/order", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log(res);
  const orders = res.data || [];
  console.log(orders);
  return (
    <div className="bg-white min-h-screen mx-auto">
      <OrderTable orders={orders} />
    </div>
  );
};

export default Page;
