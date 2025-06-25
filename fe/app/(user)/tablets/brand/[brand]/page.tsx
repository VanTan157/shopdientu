import { apiGet } from "@/lib/api";
import TabletList from "../../tablet-list";
import { Tablet } from "@/lib/types/tablet";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<Tablet[]>(
    `/tablets/get-all-tablet-by-brand/${brand}`
  );
  console.log(res);
  if (!res) return <div>Loading...</div>;
  console.log(res);
  if (!res.data) return <div>Product not found</div>;
  return <TabletList tablets={res.data} />;
}
