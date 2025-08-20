import MobileList from "@/app/(user)/mobiles/mobile-list";
import { apiGet } from "@/lib/api";
import { IMobile } from "@/lib/types/mobile";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<IMobile[]>(
    `/mobiles/get-all-mobile-by-brand/${brand}`
  );
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res.data) return <div>Product not found</div>;

  return <MobileList mobiles={res.data} />;
}
