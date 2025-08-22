import { apiGet } from "@/lib/api";
import HeadphoneTable from "./headphone-table";
import AddHeadphoneForm from "./add-headphone";
import { IHeadphone } from "@/lib/types/headphone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NotFound from "../../not-found";

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const res = await apiGet<IHeadphone[]>(
    `/headphones/get-all-headphone-by-brand/${brand}`
  );

  const brands = await apiGet<string[]>("/headphones/get-all-brand");
  if (res.error) {
    return <NotFound />;
  }
  const headphones = res.data;
  return (
    <div className="bg-white min-h-screen mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý Tai Nghe - {brand}
        </h1>
        <AddHeadphoneForm brands={brands.data ?? []} />
      </div>
      <HeadphoneTable
        headphones={headphones || []}
        brands={brands.data ?? []}
      />
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
