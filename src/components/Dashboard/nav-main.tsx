import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  subItems?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({
  items,
  showQuickCreate = true,
}: {
  items: NavItem[];
  showQuickCreate?: boolean;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <div key={item.url} className="flex flex-col">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {item.subItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <SidebarMenuItem key={subItem.url}>
                      <SidebarMenuButton
                        tooltip={subItem.title}
                        asChild
                        isActive={pathname === subItem.url}
                        className="pl-8 text-sm"
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}