import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  findCatalogItem,
  isCatalogCategory,
  showcaseComponentItems,
} from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { toDependencyEntries } from "@/lib/registry/dependencies";
import { getRegistryItemMeta } from "@/lib/registry/load";
import { loadDemos } from "@/modules/showcase/demos/registry";
import { demoSource } from "@/modules/showcase/demos/sources";
import { ComponentInstallBar } from "@/modules/showcase/components/component-install-bar";
import { DemoCard } from "@/modules/showcase/components/demo-card";
import { DocsToc } from "@/modules/showcase/components/docs-toc";
import { PageHeader } from "@/modules/showcase/components/page-header";
import { ShowcaseContentShell } from "@/layouts/showcase/showcase-content-shell";

/**
 * Chỉ prerender component có trên sidebar. Primitive vẫn truy cập được qua URL
 * trực tiếp (render động) — link trong danh sách phụ thuộc trỏ tới chúng, và
 * một link chết ở đó tệ hơn một trang dựng lúc có request.
 */
export function generateStaticParams() {
  return showcaseComponentItems.map((item) => ({ slug: item.slug }));
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

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Route `/components/{nhóm}` cũ: giữ liên kết ngoài sống, đưa về đúng section
  // trên trang tổng quan thay vì ném 404.
  if (isCatalogCategory(slug)) permanentRedirect(`/components#${slug}`);

  const item = findCatalogItem(slug);
  if (!item || item.kind !== "component") notFound();

  const { dict, locale } = await getDictionary();
  const t = dict.showcase;
  const [demos, registryItem] = await Promise.all([loadDemos(slug), getRegistryItemMeta(slug)]);
  const dependencies = registryItem ? toDependencyEntries(registryItem) : [];
  const category = item.categories[0];

  return (
    <ShowcaseContentShell>
      <PageHeader
        crumbs={[
          { label: dict.components.title, href: "/components" },
          ...(category ? [{ label: t.categories[category], href: `/components#${category}` }] : []),
          { label: item.name },
        ]}
        title={item.name}
        description={item.description[locale]}
        actions={
          <div className="flex items-center gap-2">
            {item.isNew && (
              <Badge variant="secondary" className="rounded-4xl px-2.5 py-0.5">
                {t.new}
              </Badge>
            )}
            {item.visibility === "internal" && (
              <Badge variant="outline" className="rounded-4xl px-2.5 py-0.5" title={t.internalOnlyHint}>
                {t.internalOnly}
              </Badge>
            )}
          </div>
        }
      />

      <ComponentInstallBar item={item} dependencies={dependencies} />

      {demos.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">{t.previewPending}</p>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">{t.previewPendingBody}</p>
        </div>
      ) : (
        <div className="flex gap-8">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              {t.examples}
            </h2>
            {demos.map((demo) => (
              <DemoCard
                key={demo.id}
                id={demo.id}
                slug={slug}
                title={demo.title[locale]}
                description={demo.description?.[locale]}
                source={demoSource(slug, demo.id)}
                component={demo.render}
                mode={demo.mode}
              />
            ))}
          </div>

          <div className="hidden w-44 shrink-0 lg:block">
            <DocsToc
              label={t.examples}
              sections={demos.map((demo) => ({ id: demo.id, label: demo.title[locale] }))}
            />
          </div>
        </div>
      )}
    </ShowcaseContentShell>
  );
}
