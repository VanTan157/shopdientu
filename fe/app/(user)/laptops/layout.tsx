// app/mobiles/layout.tsx

import { apiGet } from "@/lib/api";
import LaptopHeader from "./laptop-header";

export default async function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await apiGet<string[]>("/laptops/get-all-brand");

  return (
    <div className="flex">
      <LaptopHeader brands={res.data || []} />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
