import { apiGet } from "@/lib/api";
import { Tablet } from "@/lib/types/tablet";
import TabletDetail from "./tablet-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<Tablet>(`/tablets/${id}`);
  if (!res.data) return <div>Product not found</div>;
  return <TabletDetail product={res.data} />;
}
