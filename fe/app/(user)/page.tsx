import Banner from "@/components/banner";
import { apiGet } from "@/lib/api";
import MobileList from "./mobiles/mobile-list";
import LaptopList from "./laptops/laptop-list";
import HeadphoneList from "./headphones/headphone-list";
import TabletList from "./tablets/tablet-list";
import { IMobile } from "@/lib/types/mobile";
import { ILaptop } from "@/lib/types/laptop";
import { IHeadphone } from "@/lib/types/headphone";
import { ITablet } from "@/lib/types/tablet";

const Page = async () => {
  const resMobile = await apiGet<IMobile[]>("/mobiles/get-by-promotion");
  const mobiles = resMobile.data || [];
  console.log(resMobile);

  const resLaptop = await apiGet<ILaptop[]>("/laptops/get-by-promotion");
  const laptops = resLaptop.data || [];

  const resHeadphone = await apiGet<IHeadphone[]>(
    "/headphones/get-by-promotion"
  );
  const headphones = resHeadphone.data || [];

  const resTablet = await apiGet<ITablet[]>("/tablets/get-by-promotion");
  const tablets = resTablet.data || [];

  const hotDeals = [...mobiles, ...laptops, ...headphones, ...tablets];
  console.log(hotDeals);
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
