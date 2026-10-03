import type { Metadata } from "next";
import { Suspense } from "react";

import { blockItems } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ShowcaseContentShell } from "@/layouts/showcase/showcase-content-shell";
import { BlockCatalogBrowser } from "@/modules/showcase/components/block-catalog-browser";
import { PageHeader } from "@/modules/showcase/components/page-header";

export const metadata: Metadata = { title: "Blocks" };

export default async function BlocksIndexPage() {
  const { dict } = await getDictionary();

  return (
    <ShowcaseContentShell>
      <PageHeader
        crumbs={[{ label: dict.blocks.title }]}
        title={dict.blocks.title}
        count={blockItems.length}
        description={dict.blocks.subtitle}
      />

      {/* `useSearchParams` bắt buộc nằm trong Suspense. Fallback giữ đúng chiều
          cao hàng tab để trang không giật một nhịp khi phần lọc gắn vào. */}
      <Suspense fallback={<div className="h-12 rounded-md border bg-card" />}>
        <BlockCatalogBrowser items={blockItems} />
      </Suspense>
    </ShowcaseContentShell>
  );
}
