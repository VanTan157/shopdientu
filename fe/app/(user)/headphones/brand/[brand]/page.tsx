import { apiGet } from "@/lib/api";
import { Headphone } from "@/lib/types/headphone";
import HeadphoneList from "../../headphone-list";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<Headphone[]>(
    `/headphones/get-all-headphone-by-brand/${brand}`
  );
  if (!res.data) return <div>Product not found</div>;
  return <HeadphoneList headphones={res.data} />;
}
