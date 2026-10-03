import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";

export async function LandingCta() {
  const { dict } = await getDictionary();
  const cta = dict.landing.cta;

  return (
    <section>
      <LandingContainer className="py-16 md:py-20">
        <div className="flex flex-col items-center gap-5 rounded-xl border bg-linear-to-br from-primary/8 via-background to-brand-secondary/8 px-6 py-12 text-center md:px-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {cta.title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-pretty text-muted-foreground">
            {cta.body}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/docs">{cta.primary}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/components">{cta.secondary}</Link>
            </Button>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
