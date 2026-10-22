import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CodeBlock } from "@/components/data-display/code-block";
import { Badge } from "@/components/ui/badge";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import { componentCatalog, installCommand, registryItemName } from "@/config/catalog";
import {
  REGISTRY_INTERNAL_NAMESPACE,
  REGISTRY_INTERNAL_URL,
  REGISTRY_TOKEN_ENV,
} from "@/config/registry";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/modules/showcase/components/page-header";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export const metadata: Metadata = {
  title: "Khu vực nội bộ",
  robots: { index: false, follow: false },
};

const CONSUMER_CONFIG = `{
  "registries": {
    "${REGISTRY_INTERNAL_NAMESPACE}": {
      "url": "${REGISTRY_INTERNAL_URL}",
      "headers": { "Authorization": "Bearer \${${REGISTRY_TOKEN_ENV}}" }
    }
  }
}`;

export default async function InternalPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);

  // `proxy.ts` đã chặn từ trước; lớp này bắt trường hợp proxy bị bỏ qua do cấu
  // hình matcher sai — gác quyền không nên chỉ có đúng một chốt.
  if (!session) redirect("/login?redirect=/internal");

  const { dict, locale } = await getDictionary();
  const t = dict.internal;
  const items = componentCatalog.filter((item) => item.visibility === "internal");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-8 md:px-8 md:py-10">
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        description={t.subtitle}
        actions={
          <span className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">
              {t.signedInAs} <strong className="text-foreground">{session.email}</strong>
            </span>
            <LogoutButton />
          </span>
        }
      />

      <section className="flex flex-col gap-3 rounded-lg border bg-card p-5">
        <h2 className="font-medium tracking-tight text-foreground">{t.tokenTitle}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t.tokenBody}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium tracking-tight text-foreground">{t.configTitle}</h2>
        <CodeBlock code={CONSUMER_CONFIG} language="components.json" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium tracking-tight text-foreground">{t.itemsTitle}</h2>
        <ul className="divide-y rounded-lg border">
          {items.map((item) => (
            <li key={item.slug} className="flex flex-col gap-1.5 px-4 py-3">
              <span className="flex items-center gap-2">
                {item.kind === "template" ? (
                  <Link
                    href={`/templates/${item.slug}`}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{item.name}</span>
                )}
                <Badge variant="outline" className="rounded-4xl text-[11px]">
                  {registryItemName(item)}
                </Badge>
              </span>
              <span className="text-sm leading-6 text-muted-foreground">
                {item.description[locale]}
              </span>
              <code className="font-mono text-[11px] text-muted-foreground/80">
                {installCommand(item)}
              </code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
