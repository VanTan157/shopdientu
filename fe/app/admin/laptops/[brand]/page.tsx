import { apiGet } from "@/lib/api";
import LaptopTable from "./laptop-table";
import AddLaptopForm from "./add-laptop";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ILaptop } from "@/lib/types/laptop";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<ILaptop[]>(
    `/laptops/get-all-laptop-by-brand/${brand}`
  );
  const brands = await apiGet<string[]>("/laptops/get-all-brand");
  if (!res) return <div>Loading...</div>;
  if (!res.data) return <div>Product not found</div>;
  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý Laptop - {brand}
        </h1>
        <AddLaptopForm brands={brands.data ?? []} />
      </div>
      <LaptopTable laptops={res.data} />
      <div className="mt-6">
        <Link href="/admin">
          <Button variant="outline" className="text-gray-700">
            Quay lại trang quản lý
          </Button>
        </Link>
      </div>
    </div>
  );
}
