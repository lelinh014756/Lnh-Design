import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";

import { blockItems } from "@/config/catalog";
import { BlocksCatalogSidebar, ShowcaseFooter, ShowcaseShell } from "@/layouts/showcase";

export default async function BlocksLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <ShowcaseShell
      defaultSidebarOpen={defaultOpen}
      footer={<ShowcaseFooter />}
      // Sidebar đọc `?kind=` bằng `useSearchParams`; không bọc Suspense thì bất
      // kỳ trang nào trong nhánh này muốn prerender tĩnh đều fail lúc build.
      sidebar={
        <Suspense>
          <BlocksCatalogSidebar items={blockItems} />
        </Suspense>
      }
    >
      {children}
    </ShowcaseShell>
  );
}
