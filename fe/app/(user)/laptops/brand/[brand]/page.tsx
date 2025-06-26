import { apiGet } from "@/lib/api";
import { Laptop } from "@/lib/types/laptop";
import LaptopList from "../../laptop-list";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<Laptop[]>(
    `/laptops/get-all-laptop-by-brand/${brand}`
  );
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return <LaptopList laptops={res.data} />;
}
