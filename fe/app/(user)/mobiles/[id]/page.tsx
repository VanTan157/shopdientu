import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";
import MobileDetail from "./mobile-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<Mobile>(`/mobiles/${id}`);
  if (!res) return <div>Loading...</div>;
  console.log(res);
  if (!res.data) return <div>Product not found</div>;
  return <MobileDetail product={res.data} />;
}
