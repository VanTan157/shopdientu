import Footer from "@/components/footer";
import HeaderUser from "@/components/header-user";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-l from-gray-600 to-gray-800 flex flex-col text-white">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderUser />
      </header>
      <main className="mt-18 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
