// app/mobiles/layout.tsx

import LaptopHeader from "./headphone-header";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <LaptopHeader />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
