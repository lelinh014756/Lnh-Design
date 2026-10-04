import AppIcon from "@/components/general/app-icon";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";
import { cn } from "@/lib/utils";

/**
 * Hai kênh phân phối.
 *
 * Thẻ registry được nhấn hơn (viền màu thương hiệu) vì đó mới là kênh dev dùng
 * hằng ngày; npm package là thứ cài một lần rồi quên.
 */
export async function LandingChannels() {
  const { dict } = await getDictionary();
  const channels = dict.landing.channels;

  const cards = [
    {
      key: "npm",
      icon: "package" as const,
      title: channels.npmTitle,
      body: channels.npmBody,
      points: [channels.npmPoint1, channels.npmPoint2, channels.npmPoint3],
      accent: false,
    },
    {
      key: "registry",
      icon: "terminal" as const,
      title: channels.registryTitle,
      body: channels.registryBody,
      points: [channels.registryPoint1, channels.registryPoint2, channels.registryPoint3],
      accent: true,
    },
  ];

  return (
    <section className="border-b bg-muted/25">
      <LandingContainer className="flex flex-col gap-8 py-16 md:py-20">
        <header className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {channels.title}
          </h2>
          <p className="text-base leading-7 text-pretty text-muted-foreground">{channels.subtitle}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {cards.map((card) => (
            <article
              key={card.key}
              className={cn(
                "flex flex-col gap-4 rounded-lg border bg-background p-5 md:p-6",
                card.accent && "border-primary/35",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-md",
                  card.accent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                <AppIcon icon={card.icon} className="size-4.5" />
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-base font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{card.body}</p>
              </div>

              <ul className="mt-1 flex flex-col gap-2">
                {card.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                    <AppIcon icon="check"
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        card.accent ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
