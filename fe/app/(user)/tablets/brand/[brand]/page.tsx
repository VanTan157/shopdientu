import { apiGet } from "@/lib/api";
import TabletList from "../../tablet-list";
import { ITablet } from "@/lib/types/tablet";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<ITablet[]>(
    `/tablets/get-all-tablet-by-brand/${brand}`
  );
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res.data) return <div>Product not found</div>;
  return <TabletList tablets={res.data} />;
}
