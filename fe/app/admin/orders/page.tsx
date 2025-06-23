import { apiGet } from "@/lib/api";
import { cookies } from "next/headers";
import OrderTable from "./order-table";
import { Order } from "@/lib/types/order";
const Page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const res = await apiGet<Order[]>("/order", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log(res);
  const orders = res.data || [];
  console.log(orders);
  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <OrderTable orders={orders} />
    </div>
  );
};

export default Page;
