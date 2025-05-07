import { apiGet } from "@/lib/api";
import { Headphone } from "@/lib/types/headphone";
import HeadphoneDetail from "./headphone-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<Headphone>(`/headphones/${id}`);
  if (!res) return <div>Loading...</div>;
  console.log(res);
  if (!res.data) return <div>Product not found</div>;
  return <HeadphoneDetail product={res.data} />;
}
