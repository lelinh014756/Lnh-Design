import {
  getIllustrationBoxStyle,
  type IllustrationCommonProps,
} from "@/config/illustration-layout";
import { cn } from "@/lib/utils";

type StoryIllustrationProps = IllustrationCommonProps & {
  children: React.ReactNode;
  /** Accessible label for screen readers */
  label: string;
  /** Show Storyset attribution (required for free Storyset assets) */
  showAttribution?: boolean;
  attributionText?: string;
};

export function StoryIllustration({
  children,
  label,
  className,
  size,
  sizeTier = "inline",
  showAttribution = false,
  attributionText,
}: StoryIllustrationProps) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div
        role="img"
        aria-label={label}
        className="story-illustration shrink-0"
        style={getIllustrationBoxStyle({ size, sizeTier })}
      >
        {children}
      </div>
      {showAttribution && attributionText ? (
        <figcaption className="mt-2 text-center text-[10px] text-muted-foreground">
          {attributionText}{" "}
          <a
            href="https://storyset.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Storyset
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}
