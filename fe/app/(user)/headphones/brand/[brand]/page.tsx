import { apiGet } from "@/lib/api";
import { IHeadphone } from "@/lib/types/headphone";
import HeadphoneList from "../../headphone-list";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<IHeadphone[]>(
    `/headphones/get-all-headphone-by-brand/${brand}`
  );
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res.data) return <div>Product not found</div>;
  return <HeadphoneList headphones={res.data} />;
}
