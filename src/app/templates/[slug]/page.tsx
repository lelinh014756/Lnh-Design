import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommandLine } from "@/components/data-display/code-block";
import { Badge } from "@/components/ui/badge";
import { findCatalogItem, installCommand, templateItems } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/modules/showcase/components/page-header";

export function generateStaticParams() {
  return templateItems.map((item) => ({ slug: item.slug }));
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

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findCatalogItem(slug);
  if (!item || item.kind !== "template") notFound();

  const { dict, locale } = await getDictionary();
  const t = dict.templates;

  const details = [
    { label: t.framework, value: item.framework },
    { label: t.base, value: item.base },
    { label: t.style, value: item.style },
    { label: t.surface, value: item.surface },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-8 md:py-10">
      <PageHeader
        crumbs={[{ label: t.title, href: "/templates" }, { label: item.name }]}
        title={item.name}
        description={item.description[locale]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid min-h-80 place-items-center rounded-lg border border-dashed bg-linear-to-br from-primary/6 to-brand-secondary/6 text-sm text-muted-foreground">
          {dict.showcase.previewPending}
        </div>

        <aside className="flex flex-col gap-5 rounded-lg border bg-card p-5">
          {item.visibility === "internal" && (
            <p className="rounded-md border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-xs leading-5 text-amber-700 dark:text-amber-400">
              {dict.showcase.internalOnlyHint}
            </p>
          )}

          <CommandLine command={installCommand(item)} />

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{t.details}</h2>
            <dl className="divide-y rounded-lg border text-sm">
              {details.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 px-3 py-2">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="text-right font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{t.techStack}</h2>
            <ul className="flex flex-wrap gap-1.5">
              {item.techStack.map((tech) => (
                <li key={tech}>
                  <Badge variant="outline" className="font-normal">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
