import { apiGet } from "@/lib/api";
import { Mobile, MobileType } from "@/lib/types/mobile";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import MobileFilterTable from "./MobileFilterTable";
import AddMobileForm from "./AddMobileForm";

const AdminMobilePage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const resMobiles = await apiGet<Mobile[]>("/mobiles");
  const resTypes = await apiGet<MobileType[]>("/mobile-types"); // Giả định endpoint lấy MobileType
  const { type } = await params;

  const mobiles =
    resMobiles?.data?.filter((mobile) => mobile.mobile_type_id.type === type) ||
    [];
  const mobileTypes = resTypes?.data || [];

  // if (!mobiles || mobiles.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-white">
  //       <p className="text-lg text-gray-600 font-medium">
  //         Không tìm thấy điện thoại nào cho loại {type}
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề và nút thêm mới */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý điện thoại - {type}
          </h1>
          <AddMobileForm type={type} mobileTypes={mobileTypes} />
        </div>

        {/* Truyền dữ liệu sang Client Component */}
        <MobileFilterTable initialMobiles={mobiles} />

        {/* Nút quay lại */}
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
