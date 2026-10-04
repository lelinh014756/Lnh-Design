import AppIcon from "@/components/general/app-icon";

import { cn } from "@/lib/utils";

interface TableEmptyStateProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
}

export function TableEmptyState({
  title,
  description,
  className,
  ...props
}: TableEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-10 text-center",
        className,
      )}
      {...props}
    >
      <AppIcon icon="inbox" className="size-8 text-muted-foreground/60" />
      <p className="font-medium text-sm">{title}</p>
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </div>
  );
}
