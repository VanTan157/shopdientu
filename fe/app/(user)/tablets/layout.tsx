// app/mobiles/layout.tsx

import TabletHeader from "./tablet-header";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <TabletHeader />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
