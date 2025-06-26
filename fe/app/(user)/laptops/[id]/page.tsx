import { apiGet } from "@/lib/api";
import MobileDetail from "./laptop-detail";
import { Laptop } from "@/lib/types/laptop";
import LaptopDetail from "./laptop-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<Laptop>(`/laptops/${id}`);
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return <LaptopDetail product={res.data} />;
}
