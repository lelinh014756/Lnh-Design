import type { Metadata } from "next";

import { SidebarStylePicker } from "@/components/data-entry";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { readDesignTokens } from "@/lib/tokens/parse-globals";
import { PageHeader } from "@/modules/showcase/components/page-header";
import { TokenTable } from "@/modules/showcase/components/token-table";

export const metadata: Metadata = { title: "Design tokens" };

export default async function TokensPage() {
  const [{ dict }, groups] = await Promise.all([getDictionary(), readDesignTokens()]);
  const t = dict.tokens;

  const groupLabel = {
    color: t.groupColor,
    sidebar: t.groupSidebar,
    chart: t.groupChart,
    radius: t.groupRadius,
    typography: t.groupTypography,
    motion: t.groupMotion,
  } as const;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8 md:px-8 md:py-10">
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        count={groups.reduce((total, group) => total + group.tokens.length, 0)}
        description={t.subtitle}
      />

      <section className="flex flex-col gap-3 rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium tracking-tight text-foreground">{t.sidebarStyleTitle}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t.sidebarStyleHint}</p>
        </div>
        {/* Truyền nhãn từ từ điển của app — component tự nó chỉ có bản tiếng Anh. */}
        <SidebarStylePicker labels={t} />
      </section>

      {groups.map((group) => (
        <TokenTable key={group.key} title={groupLabel[group.key]} tokens={group.tokens} />
      ))}
    </div>
  );
}
