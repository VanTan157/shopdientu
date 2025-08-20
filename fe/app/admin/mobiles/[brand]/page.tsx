import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddMobileForm from "./add-mobile";
import MobileTable from "./mobile-table";
import { IMobile } from "@/lib/types/mobile";
import { toast } from "sonner";

const AdminMobilePage = async ({
  params,
}: {
  params: Promise<{ brand: string }>;
}) => {
  const { brand } = await params;

  const res = await apiGet<IMobile[]>(
    `/mobiles/get-all-mobile-by-brand/${brand}`,
    undefined,
    ["mobiles"]
  );

  if (res.error) {
    toast.error(res.message);
    return;
  }

  const mobiles = res.data;
  const brands = await apiGet<string[]>("/mobiles/get-all-brand");

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý điện thoại - {brand}
          </h1>
          <AddMobileForm brands={brands.data ?? []} />
        </div>
        <MobileTable mobiles={mobiles || []} />
        <div className="mt-6">
          <Link href="/admin">
            <Button variant="outline" className="text-gray-700">
              Quay lại trang quản lý
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminMobilePage;
