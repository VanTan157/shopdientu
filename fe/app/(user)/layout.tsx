import HeaderUser from "@/components/header-user";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderUser />
      </header>
      <main className="flex-1 flex items-center justify-center mt-20">
        {children}
      </main>
    </div>
  );
}
