import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { templateItems } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/modules/showcase/components/page-header";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesIndexPage() {
  const { dict, locale } = await getDictionary();
  const t = dict.templates;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-8 md:py-10">
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        count={templateItems.length}
        description={t.subtitle}
      />

      {templateItems.length === 0 ? (
        <p className="rounded-lg border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          {t.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {templateItems.map((item) => (
            <article
              key={item.slug}
              className="grid gap-6 rounded-lg border bg-card p-5 md:grid-cols-[1.1fr_1fr] md:p-6"
            >
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-4xl">
                    {dict.showcase.categories[item.categories[0]]}
                  </Badge>
                  {item.isNew && (
                    <Badge variant="secondary" className="rounded-4xl">
                      {dict.showcase.new}
                    </Badge>
                  )}
                  {item.visibility === "internal" && (
                    <Badge variant="outline" className="rounded-4xl">
                      {dict.showcase.internalOnly}
                    </Badge>
                  )}
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground">{item.name}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{item.description[locale]}</p>

                <ul className="flex flex-wrap gap-1.5">
                  {item.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex flex-wrap gap-2.5">
                  <Button asChild size="sm">
                    <Link href={`/templates/${item.slug}`}>{t.details}</Link>
                  </Button>
                </div>
              </div>

              <div className="grid min-h-44 place-items-center rounded-lg border border-dashed bg-linear-to-br from-primary/6 to-brand-secondary/6 text-sm text-muted-foreground">
                {dict.showcase.previewPending}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
