import Link from "next/link";

import { catalogStats } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";

/**
 * Dải số liệu.
 *
 * Đếm từ `catalogStats` chứ không viết tay: con số trên landing không bao giờ
 * hứa nhiều hơn thứ catalog thật sự có.
 */
export async function LandingStats() {
  const { dict } = await getDictionary();
  const stats = dict.landing.stats;

  const rows = [
    { href: "/components", value: catalogStats.components, label: stats.components },
    { href: "/blocks", value: catalogStats.blocks, label: stats.blocks },
    { href: "/templates", value: catalogStats.templates, label: stats.templates },
  ];

  return (
    <section className="border-b bg-muted/25">
      <LandingContainer className="flex flex-col items-center gap-5 py-10 md:py-12">
        <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
          {rows.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="group flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-background"
            >
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground md:text-4xl">
                {row.value}
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {row.label}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{stats.caption}</p>
      </LandingContainer>
    </section>
  );
}
