import { apiGet } from "@/lib/api";
import { Mobile } from "@/lib/types/mobile";
import MobileList from "../mobiles/mobile-list";
import { Laptop } from "@/lib/types/laptop";
import LaptopList from "./laptop-list";

const Page = async () => {
  const res = await apiGet<Laptop[]>("/laptops");
  const laptops = res.data || [];
  return <LaptopList laptops={laptops} />;
};

export default Page;
