import { apiGet } from "@/lib/api";
import { Headphone } from "@/lib/types/headphone";
import HeadphoneList from "./headphone-list";

const Page = async () => {
  const res = await apiGet<Headphone[]>("/headphones");
  const headphones = res.data || [];
  return <HeadphoneList headphones={headphones} />;
};

export default Page;
