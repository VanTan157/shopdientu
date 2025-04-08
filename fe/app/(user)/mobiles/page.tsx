import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/validate/mobile";
import MobileList from "../mobile-list";

const Page = async () => {
  const res = await apiGet<Mobile[]>("/mobiles");
  const mobiles = res.data || [];
  return <MobileList mobiles={mobiles} />;
};

export default Page;
