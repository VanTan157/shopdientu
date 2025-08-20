import { apiGet } from "@/lib/api";
import TabletList from "./tablet-list";
import { ITablet } from "@/lib/types/tablet";
import { toast } from "sonner";

const Page = async () => {
  const res = await apiGet<ITablet[]>("/tablets");
  if (res.error) {
    toast.error(res.message);
    return;
  }
  const tablets = res.data || [];
  return <TabletList tablets={tablets} />;
};

export default Page;
