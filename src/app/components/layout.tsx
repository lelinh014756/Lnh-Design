import type { ReactNode } from "react";
import { cookies } from "next/headers";

import {
  CATEGORY_ICONS,
  groupByCategory,
  showcaseComponentItems,
} from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { CatalogSidebar, ShowcaseFooter, ShowcaseShell } from "@/layouts/showcase";

/**
 * Đọc `sidebar_state` phía server để sidebar không nháy một nhịp mở/đóng khi
 * tải lại trang — `SidebarProvider` tự ghi cookie này.
 */
export default async function ComponentsLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const { dict } = await getDictionary();

  return (
    <ShowcaseShell
      defaultSidebarOpen={defaultOpen}
      footer={<ShowcaseFooter />}
      sidebar={
        <CatalogSidebar
          overview={{
            href: "/components",
            label: dict.showcase.overview,
            icon: "layout-grid",
            count: showcaseComponentItems.length,
          }}
          groups={groupByCategory(showcaseComponentItems).map((group) => ({
            key: group.category,
            label: dict.showcase.categories[group.category],
            icon: CATEGORY_ICONS[group.category],
            items: group.items.map((item) => ({
              href: `/components/${item.slug}`,
              label: item.name,
              badge: item.isNew ? dict.showcase.new : undefined,
            })),
          }))}
        />
      }
    >
      {children}
    </ShowcaseShell>
  );
}
