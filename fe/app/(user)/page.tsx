import Banner from "@/components/banner";
import { HydrateMobileStore } from "@/components/HydrateMobileStore";
import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";
import MobileList from "./mobile-list";

const Page = async () => {
  const res = await apiGet<Mobile[]>("/mobiles");
  const mobiles = res.data || [];
  const hotDealsMobile = mobiles.filter((p) => p.IsPromotion);
  const newMobile = mobiles
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);
  return (
    <div className="p-8">
      <HydrateMobileStore mobiles={mobiles} />
      <Banner hotDeals={hotDealsMobile} />
      <MobileList mobiles={newMobile} />
    </div>
  );
};
export default Page;
