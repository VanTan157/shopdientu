// app/mobiles/layout.tsx

import { apiGet } from "@/lib/api";
import TabletHeader from "./tablet-header";

export default async function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await apiGet<string[]>("/tablets/get-all-brand");

  return (
    <div className="flex">
      <TabletHeader brands={res.data || []} />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
