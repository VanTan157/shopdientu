import { apiGet } from "@/lib/api";
import HeadphoneTable from "./headphone-table";
import { Headphone } from "@/lib/types/headphone";
import AddHeadphoneForm from "./add-headphone";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  console.log("check", brand);
  const res = await apiGet<Headphone[]>(
    `/headphones/get-all-headphone-by-brand/${brand}`
  );
  const brands = await apiGet<string[]>("/headphones/get-all-brand");
  console.log("brands", brands);
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý Laptop - {brand}
        </h1>
        <AddHeadphoneForm brands={brands.data ?? []} />
      </div>
      <HeadphoneTable headphones={res.data} />
    </div>
  );
}
