import {
  LayoutDashboard,
  Users,
  Smartphone,
  Headphones,
  Monitor,
  Laptop,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { MobileType } from "@/lib/types/mobile";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Khách hàng",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Điện thoại",
    url: "/admin/mobiles",
    icon: Smartphone,
    hasSubmenu: true, // Thêm thuộc tính để nhận biết có submenu
  },
  {
    title: "Tai nghe",
    url: "#",
    icon: Headphones,
  },
  {
    title: "PC",
    url: "#",
    icon: Monitor,
  },
  {
    title: "Laptop",
    url: "#",
    icon: Laptop,
  },
  {
    title: "Đơn hàng",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
];

export async function AppSidebar() {
  const res = await apiGet<MobileType[]>("/mobile-types");
  const mobile_types = res.data || [];

  return (
    <Sidebar className="pt-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <Collapsible
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {mobile_types.map((type) => (
                            <SidebarMenuSubItem key={type._id}>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/admin/mobiles/${type.type}`}>
                                  <span>{type.type}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
