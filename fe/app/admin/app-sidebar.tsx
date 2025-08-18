import {
  LayoutDashboard,
  Users,
  Smartphone,
  Headphones,
  Laptop,
  ChevronDown,
  ShoppingBag,
  House,
  User,
  Tablet,
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
import AddMobileForm from "./mobiles/[brand]/add-mobile";
import AddLaptopForm from "./laptops/[brand]/add-laptop";
import AddHeadphoneForm from "./headphones/[brand]/add-headphone";
import AddTabletForm from "./tablet/[brand]/add-tablet";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Khách hàng",
    url: "/admin/customers",
    icon: User,
  },
  {
    title: "Điện thoại",
    url: "/admin/mobiles",
    icon: Smartphone,
    hasSubmenu: true,
  },
  {
    title: "Tai nghe",
    url: "#",
    icon: Headphones,
    hasSubmenu: true,
  },
  {
    title: "Máy tính bảng",
    url: "#",
    icon: Tablet,
    hasSubmenu: true,
  },
  {
    title: "Laptop",
    url: "/admin/laptops",
    icon: Laptop,
    hasSubmenu: true,
  },
  {
    title: "Đơn hàng",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Trang chủ",
    url: "/",
    icon: House,
  },
];

export async function AppSidebar() {
  const resBrandsMobile = await apiGet<string[]>("/mobiles/get-all-brand");
  const brands_mobile = resBrandsMobile.data || [];
  console.log(resBrandsMobile);

  const resBrandsLaptop = await apiGet<string[]>("/laptops/get-all-brand");
  const brands_laptop = resBrandsLaptop.data || [];

  const resBrandsHeadphone = await apiGet<string[]>(
    "/headphones/get-all-brand"
  );
  const brands_headphone = resBrandsHeadphone.data || [];

  const resBrandsTablet = await apiGet<string[]>("/tablets/get-all-brand");
  const brands_tablet = resBrandsTablet.data || [];

  return (
    <Sidebar className="pt-6 bg-white shadow-lg">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 text-gray-700">
              {/* You can use a different icon here, e.g. Users or House */}
              <Users className="w-6 h-6 text-gray-700" />
            </span>
            Quản lý
          </SidebarGroupLabel>
          <hr className="pb-2" />
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
                          {item.title === "Điện thoại" &&
                            (brands_mobile.length === 0 ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">
                                  Hiện tại chưa có sản phẩm nào
                                </p>
                                <AddMobileForm />
                              </div>
                            ) : (
                              brands_mobile.map((brand, index) => (
                                <SidebarMenuSubItem key={index}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/admin/mobiles/${brand}`}>
                                      <span>{brand}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))
                            ))}

                          {item.title === "Laptop" &&
                            (brands_laptop.length === 0 ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">
                                  Hiện tại chưa có sản phầm nào
                                </p>
                                <AddLaptopForm />
                              </div>
                            ) : (
                              brands_laptop.map((brand, index) => (
                                <SidebarMenuSubItem key={index}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/admin/laptops/${brand}`}>
                                      <span>{brand}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))
                            ))}

                          {item.title === "Tai nghe" &&
                            (brands_headphone.length === 0 ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">
                                  Hiện tại chưa có sản phẩm nào
                                </p>
                                <AddHeadphoneForm />
                              </div>
                            ) : (
                              brands_headphone.map((brand, index) => (
                                <SidebarMenuSubItem key={index}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/admin/headphones/${brand}`}>
                                      <span>{brand}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))
                            ))}

                          {item.title === "Máy tính bảng" &&
                            (brands_tablet.length === 0 ? (
                              <div>
                                <p className="text-gray-500 text-sm mb-2">
                                  Hiện tại chưa có sản phẩm nào
                                </p>
                                <AddTabletForm />
                              </div>
                            ) : (
                              brands_tablet.map((brand, index) => (
                                <SidebarMenuSubItem key={index}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/admin/tablet/${brand}`}>
                                      <span>{brand}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))
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
