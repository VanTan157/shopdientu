import { apiGet } from "@/lib/api";
import TabletList from "./tablet-list";
import { Tablet } from "@/lib/types/tablet";

const Page = async () => {
  const res = await apiGet<Tablet[]>("/tablets");
  const tablets = res.data || [];
  return <TabletList tablets={tablets} />;
};

export default Page;
