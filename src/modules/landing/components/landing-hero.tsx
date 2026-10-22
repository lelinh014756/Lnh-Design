import Link from "next/link";

import { CommandLine } from "@/components/data-display/code-block";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";
import { REGISTRY_NAMESPACE } from "@/config/registry";

/**
 * Hero.
 *
 * Nửa sau tiêu đề dùng `--brand-secondary` làm điểm dừng thứ hai của gradient —
 * cùng cặp màu đã khai trong `globals.css`, không tự chọn màu mới tại chỗ.
 */
export async function LandingHero() {
  const { dict } = await getDictionary();
  const hero = dict.landing.hero;
  const plain = hero.title.replace(hero.titleAccent, "").trim();

  return (
    <section className="relative overflow-hidden border-b">
      {/* Quầng sáng sau tiêu đề. Dùng radial-gradient thay vì ảnh: nó tự theo
          token màu ở cả hai theme và không tốn thêm một request. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[28rem] opacity-[0.16] blur-3xl"
        style={{
          background:
            "radial-gradient(45% 60% at 50% 50%, var(--primary) 0%, var(--brand-secondary) 55%, transparent 100%)",
        }}
      />

      <LandingContainer className="relative flex flex-col items-center gap-7 py-20 text-center md:py-28">
        <span className="inline-flex items-center gap-2 rounded-4xl border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {hero.eyebrow}
        </span>

        <h1 className="max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground md:text-6xl">
          {plain}{" "}
          <span className="bg-linear-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
            {hero.titleAccent}
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-7 text-pretty text-muted-foreground md:text-lg md:leading-8">
          {hero.subtitle}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/docs">{hero.ctaPrimary}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/components">{hero.ctaSecondary}</Link>
          </Button>
        </div>

        <div className="mt-2 w-full max-w-xl text-left">
          <p className="mb-2 text-xs text-muted-foreground">{hero.installHint}</p>
          <CommandLine command={`pnpm dlx shadcn@latest add ${REGISTRY_NAMESPACE}/data-table`} />
        </div>
      </LandingContainer>
    </section>
  );
}
