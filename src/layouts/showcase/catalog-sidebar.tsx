"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import AppIcon, { type IconName } from "@/components/general/app-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface CatalogSidebarItem {
  href: string;
  label: string;
  /** Nhãn phụ bên phải: "Mới", "Nội bộ". Bỏ trống thì không chiếm chỗ. */
  badge?: string;
}

export interface CatalogSidebarGroup {
  key: string;
  label: string;
  icon: IconName;
  items: CatalogSidebarItem[];
}

export interface CatalogSidebarProps {
  /** Mục đứng riêng trên đầu, không thuộc nhóm nào. */
  overview: CatalogSidebarItem & { count: number; icon: IconName };
  groups: CatalogSidebarGroup[];
  /** Chèn trên mục tổng quan — `/blocks` dùng để đặt bộ chọn loại. */
  header?: ReactNode;
}

/**
 * Sidebar duyệt catalog: một mục tổng quan đứng riêng, bên dưới là các nhóm,
 * mỗi nhóm liệt kê THẲNG từng item.
 *
 * Thuần hiển thị — dữ liệu nhóm do layout phía server dựng, nên cùng một
 * component phục vụ cả `/components` lẫn `/blocks` mà không cần biết nó đang ở
 * khu vực nào.
 *
 * Không có ô lọc tại chỗ: `CommandSearch` trên header đã tìm xuyên toàn bộ
 * catalog, thêm một ô nữa chỉ là hai đường đi cho cùng một ý định.
 */
export function CatalogSidebar({ overview, groups, header }: CatalogSidebarProps) {
  const pathname = usePathname();

  // So bằng phần đường dẫn: href có thể mang `?kind=` để giữ ngữ cảnh lọc, mà
  // `usePathname` không bao giờ chứa query — so nguyên chuỗi là không mục nào sáng.
  const isActive = (href: string) => pathname === href.split("?")[0];

  return (
    <Sidebar className="top-14 h-[calc(100dvh-3.5rem)]">
      <SidebarContent className="gap-1 px-1 py-3">
        {header && <div className="px-2 pb-1">{header}</div>}

        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(overview.href)}>
                  <Link href={overview.href}>
                    <AppIcon icon={overview.icon} size={16} />
                    <span className="truncate">{overview.label}</span>
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                      {overview.count}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {groups.map((group) => (
          <SidebarGroup key={group.key} className="py-0">
            <SidebarGroupLabel className="gap-2 pl-2">
              <AppIcon icon={group.icon} size={13} className="opacity-70" />
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                      >
                        <Link href={item.href} className="pl-4">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ml-auto rounded-4xl border px-1.5 text-[10px] leading-4",
                                active
                                  ? "border-sidebar-primary-foreground/30 text-sidebar-primary-foreground/80"
                                  : "border-border text-muted-foreground",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default CatalogSidebar;
