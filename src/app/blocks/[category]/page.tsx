import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  blockItems,
  blocksOfKind,
  CATALOG_CATEGORIES,
  isBlockKind,
  isCatalogCategory,
  itemsInCategory,
} from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { toDependencyEntries } from "@/lib/registry/dependencies";
import { getRegistryItemMeta } from "@/lib/registry/load";
import { ShowcaseContentShell } from "@/layouts/showcase/showcase-content-shell";
import { BlockShowcaseCard } from "@/modules/showcase/components/block-showcase-card";
import { PageHeader } from "@/modules/showcase/components/page-header";

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCatalogCategory(category)) return {};

  const { dict } = await getDictionary();
  return { title: `${dict.showcase.categories[category]} · Blocks` };
}

/**
 * Trang nhóm block: mọi block trong nhóm xếp dọc, mỗi cái một card đầy đủ.
 *
 * Không rút gọn thành lưới thumbnail: block là màn hình chạy được, thứ người
 * dùng cần thấy là nó chạy ra sao ở bề rộng thật — không phải một ảnh nhỏ.
 */
export default async function BlockCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { category } = await params;
  if (!isCatalogCategory(category)) notFound();

  const { kind } = await searchParams;
  const { dict } = await getDictionary();
  const inCategory = itemsInCategory(blockItems, category);
  const items = blocksOfKind(inCategory, kind && isBlockKind(kind) ? kind : "all");

  const withDependencies = await Promise.all(
    items.map(async (item) => {
      const registryItem = await getRegistryItemMeta(item.slug);
      return { item, dependencies: registryItem ? toDependencyEntries(registryItem) : [] };
    }),
  );

  const label = dict.showcase.categories[category];
  const backHref = kind && isBlockKind(kind) ? `/blocks?kind=${kind}` : "/blocks";

  return (
    <ShowcaseContentShell>
      <PageHeader
        crumbs={[{ label: dict.blocks.title, href: backHref }, { label }]}
        title={label}
        count={items.length}
        description={dict.showcase.categoryHints[category]}
      />

      {withDependencies.length === 0 ? (
        <p className="rounded-lg border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          {dict.blocks.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {withDependencies.map(({ item, dependencies }) => (
            <BlockShowcaseCard
              key={item.slug}
              item={item}
              dependencies={dependencies}
              href={`/blocks/${category}/${item.slug}`}
              kindLabel={dict.blocks.kinds[item.blockKind]}
            />
          ))}
        </div>
      )}
    </ShowcaseContentShell>
  );
}
