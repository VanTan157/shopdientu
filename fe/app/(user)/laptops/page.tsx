import { apiGet } from "@/lib/api";
import { Laptop } from "@/lib/types/laptop";
import LaptopList from "./laptop-list";

const Page = async () => {
  const res = await apiGet<Laptop[]>("/laptops");
  const laptops = res.data || [];
  return <LaptopList laptops={laptops} />;
};

export default Page;
