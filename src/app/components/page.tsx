import type { Metadata } from "next";

import AppIcon from "@/components/general/app-icon";
import { CATEGORY_ICONS, groupByCategory, showcaseComponentItems } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ComponentIndexCard } from "@/modules/showcase/components/component-index-card";
import { PageHeader } from "@/modules/showcase/components/page-header";
import { ShowcaseContentShell } from "@/layouts/showcase/showcase-content-shell";

export const metadata: Metadata = { title: "Components" };

/**
 * Trang tổng quan: mọi component, xếp theo nhóm, mỗi nhóm một section có neo.
 *
 * Neo `id={category}` là đích của redirect từ route `/components/{nhóm}` cũ —
 * bookmark cũ vẫn tới đúng chỗ cần tới.
 */
export default async function ComponentsIndexPage() {
  const { dict, locale } = await getDictionary();
  const t = dict.components;
  const showcase = dict.showcase;
  const groups = groupByCategory(showcaseComponentItems);

  return (
    <ShowcaseContentShell>
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        count={showcaseComponentItems.length}
        description={t.subtitle}
      />

      {groups.map((group) => (
        <section key={group.category} id={group.category} className="scroll-mt-20">
          <header className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <AppIcon icon={CATEGORY_ICONS[group.category]} size={17} className="text-muted-foreground" />
              {showcase.categories[group.category]}
            </h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {group.items.length} {t.countSuffix}
            </span>
            <p className="w-full text-sm leading-6 text-muted-foreground md:w-auto">
              {showcase.categoryHints[group.category]}
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <ComponentIndexCard
                key={item.slug}
                item={item}
                locale={locale}
                newLabel={showcase.new}
                internalLabel={showcase.internalOnly}
              />
            ))}
          </div>
        </section>
      ))}
    </ShowcaseContentShell>
  );
}
