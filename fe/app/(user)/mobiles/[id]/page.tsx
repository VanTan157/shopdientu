import { apiGet } from "@/lib/api";

import MobileDetail from "./mobile-detail";
import { IMobile } from "@/lib/types/mobile";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<IMobile>(`/mobiles/${id}`);
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return <MobileDetail product={res.data} />;
}
