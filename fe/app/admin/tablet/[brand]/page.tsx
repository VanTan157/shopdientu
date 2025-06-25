import { apiGet } from "@/lib/api";
import LaptopTable from "./tablet-table";

import AddLaptopForm from "./add-tablet";
import { Tablet } from "@/lib/types/tablet";
import AddTabletForm from "./add-tablet";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  console.log("check", brand);
  const res = await apiGet<Tablet[]>(
    `/tablets/get-all-tablet-by-brand/${brand}`
  );
  const brands = await apiGet<string[]>("/tablets/get-all-brand");
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý máy tính bảng - {brand}
        </h1>
        <AddTabletForm brands={brands.data ?? []} />
      </div>
      <LaptopTable tablets={res.data} />
    </div>
  );
}
