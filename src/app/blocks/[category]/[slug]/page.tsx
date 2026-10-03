import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blockItems, findCatalogItem, isBlockKind, isCatalogCategory } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { toDependencyEntries } from "@/lib/registry/dependencies";
import { getRegistryItemMeta } from "@/lib/registry/load";
import { ShowcaseContentShell } from "@/layouts/showcase/showcase-content-shell";
import { BlockShowcaseCard } from "@/modules/showcase/components/block-showcase-card";
import { PageHeader } from "@/modules/showcase/components/page-header";

export function generateStaticParams() {
  return blockItems.map((item) => ({ category: item.categories[0], slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findCatalogItem(slug);
  return item ? { title: item.name } : {};
}

export default async function BlockDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { category, slug } = await params;
  const item = findCatalogItem(slug);

  if (!item || item.kind !== "block" || !isCatalogCategory(category)) notFound();

  const { kind } = await searchParams;
  const { dict, locale } = await getDictionary();
  // Phụ thuộc đọc từ registry đã build, không từ catalog — một nguồn duy nhất.
  const registryItem = await getRegistryItemMeta(slug);
  const dependencies = registryItem ? toDependencyEntries(registryItem) : [];
  const suffix = kind && isBlockKind(kind) ? `?kind=${kind}` : "";

  return (
    <ShowcaseContentShell>
      <PageHeader
        crumbs={[
          { label: dict.blocks.title, href: `/blocks${suffix}` },
          { label: dict.showcase.categories[category], href: `/blocks/${category}${suffix}` },
          { label: item.name },
        ]}
        title={item.name}
        description={item.description[locale]}
      />

      <BlockShowcaseCard
        item={item}
        dependencies={dependencies}
        kindLabel={dict.blocks.kinds[item.blockKind]}
      />
    </ShowcaseContentShell>
  );
}
