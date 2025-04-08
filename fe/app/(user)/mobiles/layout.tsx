// app/mobiles/layout.tsx

import MobileHeader from "./mobile-header";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <MobileHeader />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
