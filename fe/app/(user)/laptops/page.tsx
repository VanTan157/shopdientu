import { apiGet } from "@/lib/api";
import LaptopList from "./laptop-list";
import { ILaptop } from "@/lib/types/laptop";
import { toast } from "sonner";

const Page = async () => {
  const res = await apiGet<ILaptop[]>("/laptops");
  if (res.error) {
    toast.error(res.message);
    return;
  }
  const laptops = res.data || [];
  return <LaptopList laptops={laptops} />;
};

export default Page;
