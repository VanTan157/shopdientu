import MobileList from "@/app/(user)/mobiles/mobile-list";
import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<Mobile[]>(
    `/mobiles/get-all-mobile-by-brand/${brand}`
  );
  if (!res.data) return <div>Product not found</div>;

  const mobiles = res.data || [];
  return <MobileList mobiles={res.data} />;
}
