import { apiGet } from "@/lib/api";
import MobileHeader from "./mobile-header";

export default async function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await apiGet<string[]>("/mobiles/get-all-brand");
  return (
    <div className="flex">
      <MobileHeader brands={res.data || []} />
      <div className="ml-16 flex-1 ">{children}</div>
    </div>
  );
}
