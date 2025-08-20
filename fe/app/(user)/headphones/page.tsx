import { apiGet } from "@/lib/api";
import HeadphoneList from "./headphone-list";
import { IHeadphone } from "@/lib/types/headphone";
import { toast } from "sonner";

const Page = async () => {
  const res = await apiGet<IHeadphone[]>("/headphones");
  if (res.error) {
    toast.error(res.message);
    return;
  }
  const headphones = res.data || [];
  return <HeadphoneList headphones={headphones} />;
};

export default Page;
