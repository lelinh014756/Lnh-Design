import { CodeBlock, CommandLine } from "@/components/data-display/code-block";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";
import { REGISTRY_NAMESPACE, REGISTRY_PUBLIC_URL } from "@/config/registry";

const REGISTRY_SNIPPET = `{
  "registries": {
    "${REGISTRY_NAMESPACE}": "${REGISTRY_PUBLIC_URL}"
  }
}`;

const EDIT_SNIPPET = `// src/components/ui/data-table/data-table.tsx
// File nằm trong repo bạn — sửa thẳng, không chờ ai release.
<DataTable table={table} emptyState={<HtxEmptyState />} />`;

/**
 * Ba bước dùng registry.
 *
 * Mỗi bước kèm đúng một mẩu mã chép được — bước nào không có mã thì không đáng
 * là một bước riêng.
 */
export async function LandingUsage() {
  const { dict } = await getDictionary();
  const usage = dict.landing.usage;

  const steps = [
    {
      title: usage.step1Title,
      body: usage.step1Body,
      snippet: <CodeBlock code={REGISTRY_SNIPPET} language="components.json" />,
    },
    {
      title: usage.step2Title,
      body: usage.step2Body,
      snippet: <CommandLine command={`pnpm dlx shadcn@latest add ${REGISTRY_NAMESPACE}/app-button`} />,
    },
    {
      title: usage.step3Title,
      body: usage.step3Body,
      snippet: <CodeBlock code={EDIT_SNIPPET} language="tsx" />,
    },
  ];

  return (
    <section className="border-b">
      <LandingContainer className="flex flex-col gap-10 py-16 md:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {usage.title}
        </h2>

        <ol className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="grid gap-4 md:grid-cols-[auto_20rem_1fr] md:items-start md:gap-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/8 font-mono text-sm font-medium text-primary">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-medium tracking-tight text-foreground">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
              <div className="min-w-0">{step.snippet}</div>
            </li>
          ))}
        </ol>
      </LandingContainer>
    </section>
  );
}
