import MobileList from "@/app/(user)/mobile-list";
import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/validate/mobile";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const res = await apiGet<Mobile[]>(`/mobiles/type/${id}`);
  const mobiles = res.data || [];
  return <MobileList mobiles={mobiles} />;
};

export default Page;
