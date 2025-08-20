import { apiGet } from "@/lib/api";
import LaptopDetail from "./laptop-detail";
import { ILaptop } from "@/lib/types/laptop";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<ILaptop>(`/laptops/${id}`);
  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return <LaptopDetail product={res.data} />;
}
