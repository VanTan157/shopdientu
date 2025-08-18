import { apiGet } from "@/lib/api";
import HeadphoneHeader from "./headphone-header";

export default async function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await apiGet<string[]>("/headphones/get-all-brand");
  return (
    <div className="flex">
      <HeadphoneHeader brands={res.data || []} />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
