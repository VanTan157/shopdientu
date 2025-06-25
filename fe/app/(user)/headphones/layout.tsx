import HeadphoneHeader from "./headphone-header";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <HeadphoneHeader />
      <div className="ml-16 flex-1">{children}</div>
    </div>
  );
}
