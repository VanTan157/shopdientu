import Banner from "@/components/banner";
import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";
import MobileList from "./mobiles/mobile-list";
import { Laptop } from "@/lib/types/laptop";
import LaptopList from "./laptops/laptop-list";
import { Headphone } from "@/lib/types/headphone";
import HeadphoneList from "./headphones/headphone-list";
import { Tablet } from "@/lib/types/tablet";
import TabletList from "./tablets/tablet-list";

const Page = async () => {
  const resMobile = await apiGet<Mobile[]>("/mobiles/get-by-promotion");
  const mobiles = resMobile.data || [];

  const resLaptop = await apiGet<Laptop[]>("/laptops/get-by-promotion");
  const laptops = resLaptop.data || [];

  const resHeadphone = await apiGet<Headphone[]>(
    "/headphones/get-by-promotion"
  );
  const headphones = resHeadphone.data || [];

  const resTablet = await apiGet<Tablet[]>("/tablets/get-by-promotion");
  const tablets = resTablet.data || [];

  const hotDeals = [...mobiles, ...laptops, ...headphones, ...tablets];
  return (
    <div className="p-8">
      <Banner hotDeals={hotDeals} />
      <MobileList mobiles={mobiles} />
      <LaptopList laptops={laptops} />
      <HeadphoneList headphones={headphones} />
      <TabletList tablets={tablets} />
    </div>
  );
};
export default Page;
