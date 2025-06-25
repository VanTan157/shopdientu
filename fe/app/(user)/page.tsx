import Banner from "@/components/banner";
import { HydrateMobileStore } from "@/components/HydrateMobileStore";
import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";
import MobileList from "./mobiles/mobile-list";
import { Laptop } from "@/lib/types/laptop";
import LaptopList from "./laptops/laptop-list";
import { Headphone } from "@/lib/types/headphone";
import HeadphoneList from "./headphones/headphone-list";
import { Tablet } from "@/lib/types/tablet";
import { Table } from "lucide-react";
import TabletList from "./tablets/tablet-list";

const Page = async () => {
  const resMobile = await apiGet<Mobile[]>("/mobiles");
  const mobiles = resMobile.data || [];
  const hotDealsMobile = mobiles.filter((p) => p.IsPromotion);

  const resLaptop = await apiGet<Laptop[]>("/laptops");
  const laptops = resLaptop.data || [];
  const hotDealsLaptop = laptops.filter((p) => p.isPromotion);

  const resHeadphone = await apiGet<Headphone[]>("/headphones");
  const headphones = resHeadphone.data || [];
  const hotDealsHeadphone = headphones.filter((p) => p.isPromotion);

  const resTablet = await apiGet<Tablet[]>("/tablets");
  const tablets = resTablet.data || [];
  const hotDealsTablet = tablets.filter((p) => p.isPromotion);

  const hotDeals = [
    ...hotDealsMobile,
    ...hotDealsLaptop,
    ...hotDealsHeadphone,
    ...hotDealsTablet,
  ];
  return (
    <div className="p-8">
      <HydrateMobileStore mobiles={mobiles} />
      <Banner hotDeals={hotDeals} />
      <MobileList mobiles={mobiles} />
      <LaptopList laptops={laptops} />
      <HeadphoneList headphones={headphones} />
      <TabletList tablets={tablets} />
    </div>
  );
};
export default Page;
