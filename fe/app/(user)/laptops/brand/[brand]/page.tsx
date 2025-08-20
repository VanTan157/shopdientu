import { apiGet } from "@/lib/api";
import LaptopList from "../../laptop-list";
import { ILaptop } from "@/lib/types/laptop";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<ILaptop[]>(
    `/laptops/get-all-laptop-by-brand/${brand}`
  );
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res.data) return <div>Product not found</div>;
  return <LaptopList laptops={res.data} />;
}
