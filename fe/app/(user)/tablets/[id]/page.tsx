import { apiGet } from "@/lib/api";
import TabletDetail from "./tablet-detail";
import { ITablet } from "@/lib/types/tablet";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<ITablet>(`/tablets/${id}`);
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res.data) return <div>Product not found</div>;
  return <TabletDetail product={res.data} />;
}
