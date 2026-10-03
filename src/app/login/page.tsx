import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { AppLogo } from "@/layouts/showcase";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: target } = await searchParams;
  const cookieStore = await cookies();

  // Đã có phiên hợp lệ thì không có gì để làm ở trang này.
  if (await verifySession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect(target && target.startsWith("/") ? target : "/internal");
  }

  const { dict } = await getDictionary();
  const t = dict.auth;

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary to-brand-secondary p-10 text-primary-foreground lg:flex">
        <AppLogo className="[&_span:last-child]:text-primary-foreground" />
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">{t.heroTitle}</h2>
          <p className="max-w-sm leading-7 text-primary-foreground/85">{t.heroBody}</p>
        </div>
        <span className="text-sm text-primary-foreground/70">AureCook</span>
      </div>

      <div className="flex flex-col justify-center gap-8 px-6 py-12 md:px-14">
        <div className="flex flex-col gap-2 lg:hidden">
          <AppLogo />
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">{t.subtitle}</p>
        </header>

        <LoginForm redirectTo={target && target.startsWith("/") ? target : "/internal"} />

        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {t.backHome}
        </Link>
      </div>
    </main>
  );
}
