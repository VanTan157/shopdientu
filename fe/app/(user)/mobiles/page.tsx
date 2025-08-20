import { apiGet } from "@/lib/api";
import MobileList from "./mobile-list";
import { IMobile } from "@/lib/types/mobile";

const Page = async () => {
  const res = await apiGet<IMobile[]>("/mobiles");
  const mobiles = res.data || [];
  return <MobileList mobiles={mobiles} />;
};

export default Page;
