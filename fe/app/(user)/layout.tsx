import Footer from "@/components/footer";
import HeaderUser from "@/components/header-user";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderUser />
      </header>
      <main className="mt-20 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
