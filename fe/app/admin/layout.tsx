import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="flex min-h-screen bg-white">
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger className="fixed top-0 left-0 z-10 cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
