import type { Metadata } from "next";

import { CodeBlock, CommandLine } from "@/components/data-display/code-block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/modules/showcase/components/page-header";
import { DocsToc } from "@/modules/showcase/components/docs-toc";

export const metadata: Metadata = { title: "Docs" };

const PUBLIC_REGISTRY = `{
  "registries": {
    "@aurecook": "https://aurecook.vercel.app/r/{name}.json"
  }
}`;

const INTERNAL_REGISTRY = `{
  "registries": {
    "@aurecook": "https://aurecook.vercel.app/r/{name}.json",
    "@aurecook-x": {
      "url": "https://aurecook.vercel.app/r/internal/{name}.json",
      "headers": { "Authorization": "Bearer \${AURECOOK_TOKEN}" }
    }
  }
}`;

const I18N_EXAMPLE = `// 1. labels prop — thắng tất cả
<TableDensityToggle table={table} labels={{ trigger: "Đổi mật độ" }} />

// 2. localization — dịch cả cụm một lần
const table = useTableCore({ columns, data, localization: tableLocalizationVi })

// 3. không truyền gì — item dùng mặc định tiếng Anh gắn sẵn`;

/**
 * Trang tài liệu.
 *
 * Một trang dài kèm mục lục bên phải, không phải nhiều trang lồng nhau: nội
 * dung tối thiểu vừa đủ đọc một lượt, và chẻ nhỏ ra chỉ bắt người đọc bấm thêm
 * để ghép lại đúng thứ tự vừa bị chẻ.
 */
export default async function DocsPage() {
  const { dict } = await getDictionary();
  const t = dict.docs;
  const s = t.sections;

  const sections = [
    { id: "intro", label: s.intro.title },
    { id: "install", label: s.install.title },
    { id: "internal", label: s.internal.title },
    { id: "i18n", label: s.i18n.title },
    { id: "update", label: s.update.title },
    { id: "conventions", label: s.conventions.title },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:px-8 md:py-10 lg:grid-cols-[1fr_14rem]">
      <div className="flex min-w-0 flex-col gap-10">
        <PageHeader crumbs={[{ label: t.title }]} title={t.title} description={t.subtitle} />

        <section id="intro" className="flex scroll-mt-20 flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.intro.title}</h2>
          <p className="leading-7 text-pretty text-muted-foreground">{s.intro.body}</p>
        </section>

        <section id="install" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.install.title}</h2>
          <p className="leading-7 text-muted-foreground">{s.install.step1}</p>
          <CodeBlock code={PUBLIC_REGISTRY} language="components.json" />
          <p className="leading-7 text-muted-foreground">{s.install.step2}</p>
          <CommandLine command="pnpm dlx shadcn@latest add @aurecook/data-table" />
          <p className="leading-7 text-muted-foreground">{s.install.step3}</p>
        </section>

        <section id="internal" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {s.internal.title}
          </h2>
          <p className="leading-7 text-muted-foreground">{s.internal.body}</p>
          <CodeBlock code={INTERNAL_REGISTRY} language="components.json" />
          <CommandLine command="pnpm dlx shadcn@latest add @aurecook-x/dev-portal" />
        </section>

        <section id="i18n" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.i18n.title}</h2>
          <p className="leading-7 text-muted-foreground">{s.i18n.body}</p>
          <ol className="flex flex-col gap-2.5">
            {[s.i18n.tier1, s.i18n.tier2, s.i18n.tier3].map((tier, index) => (
              <li key={tier} className="flex items-start gap-3 text-sm leading-6">
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/8 font-mono text-[11px] text-primary">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{tier}</span>
              </li>
            ))}
          </ol>
          <CodeBlock code={I18N_EXAMPLE} language="tsx" />
          <Alert>
            <AlertTitle>{s.i18n.title}</AlertTitle>
            <AlertDescription>{s.i18n.warning}</AlertDescription>
          </Alert>
        </section>

        <section id="update" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.update.title}</h2>
          <p className="leading-7 text-muted-foreground">{s.update.body}</p>
          <Alert variant="destructive">
            <AlertTitle>{s.update.title}</AlertTitle>
            <AlertDescription>{s.update.warning}</AlertDescription>
          </Alert>
        </section>

        <section id="conventions" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {s.conventions.title}
          </h2>
          <ul className="flex flex-col gap-2.5">
            {[s.conventions.naming, s.conventions.loc, s.conventions.icons, s.conventions.comments].map(
              (line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm leading-6">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span className="text-muted-foreground">{line}</span>
                </li>
              ),
            )}
          </ul>
        </section>
      </div>

      <DocsToc label={t.onThisPage} sections={sections} />
    </div>
  );
}
