import { apiGet } from "@/lib/api";
import HeadphoneDetail from "./headphone-detail";
import { IHeadphone } from "@/lib/types/headphone";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<IHeadphone>(`/headphones/${id}`);
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return <HeadphoneDetail product={res.data} />;
}
