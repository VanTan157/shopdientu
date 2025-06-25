import { apiGet } from "@/lib/api";
import { Headphone } from "@/lib/types/headphone";
import { Laptop } from "@/lib/types/laptop";
import { Mobile } from "@/lib/types/mobile";
import MobileList from "../mobiles/mobile-list";
import LaptopList from "../laptops/laptop-list";
import HeadphoneList from "../headphones/headphone-list";
import { Tablet } from "@/lib/types/tablet";
import TabletList from "../tablets/tablet-list";

type SearchPageProps = {
  searchParams: { [key: string]: string };
};

const Page = async ({ searchParams }: SearchPageProps) => {
  const query = await searchParams.query?.toLowerCase();
  const resMobile = await apiGet<Mobile[]>("/mobiles");
  const mobiles = resMobile.data || [];

  const resLaptop = await apiGet<Laptop[]>("/laptops");
  const laptops = resLaptop.data || [];

  const resHeadphone = await apiGet<Headphone[]>("/headphones");
  const headphones = resHeadphone.data || [];

  const resTablet = await apiGet<Tablet[]>("/tablets");
  const tablets = resTablet.data || [];

  const filteredMobiles = mobiles.filter((mobile) =>
    mobile.tags.some((tag) => tag.toLowerCase().includes(query || ""))
  );

  const filteredLaptops = laptops.filter((laptop) =>
    laptop.tags.some((tag) => tag.toLowerCase().includes(query || ""))
  );

  const filteredHeadphones = headphones.filter((headphone) =>
    headphone.tags.some((tag) => tag.toLowerCase().includes(query || ""))
  );

  const filteredTablets = tablets.filter((tablet) =>
    tablet.tags.some((tag) => tag.toLowerCase().includes(query || ""))
  );

  return (
    <div>
      {filteredMobiles.length == 0 &&
      filteredLaptops.length == 0 &&
      filteredHeadphones.length == 0 &&
      filteredTablets.length == 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}".
        </div>
      ) : (
        <div>
          {filteredMobiles.length > 0 && (
            <MobileList mobiles={filteredMobiles} />
          )}
          {filteredLaptops.length > 0 && (
            <LaptopList laptops={filteredLaptops} />
          )}
          {filteredHeadphones.length > 0 && (
            <HeadphoneList headphones={filteredHeadphones} />
          )}
          {filteredTablets.length > 0 && (
            <TabletList tablets={filteredTablets} />
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
