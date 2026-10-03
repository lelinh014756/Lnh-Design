import type { Locale } from "@/lib/i18n/types";
import type { PropDoc } from "@/modules/showcase/demos/types";

import { InlineCodeText } from "./inline-code-text";

interface PropsTableProps {
  /** Neo trong trang; `DocsToc` bám vào đúng id này. */
  id: string;
  title: string;
  labels: { name: string; type: string; default: string; description: string };
  items: PropDoc[];
  locale: Locale;
}

/** Bảng API của component, đặt sau phần ví dụ. */
export function PropsTable({ id, title, labels, items, locale }: PropsTableProps) {
  return (
    <section aria-labelledby={id} className="mt-7">
      <h2
        id={id}
        className="scroll-mt-20 text-sm font-medium tracking-wide text-muted-foreground uppercase"
      >
        {title}
      </h2>
      <div className="mt-3 overflow-x-auto rounded-md border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium whitespace-nowrap">{labels.name}</th>
              <th scope="col" className="px-3 py-2 font-medium whitespace-nowrap">{labels.type}</th>
              <th scope="col" className="px-3 py-2 font-medium whitespace-nowrap">{labels.default}</th>
              <th scope="col" className="px-3 py-2 font-medium whitespace-nowrap">{labels.description}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((prop) => (
              <tr key={prop.name} className="align-top">
                <td className="px-3 py-2 font-mono whitespace-nowrap">
                  {prop.name}
                  {prop.required && <span className="text-destructive">*</span>}
                </td>
                <td className="px-3 py-2 font-mono text-muted-foreground">{prop.type}</td>
                <td className="px-3 py-2 font-mono whitespace-nowrap text-muted-foreground">
                  {prop.default ?? "—"}
                </td>
                <td className="px-3 py-2 leading-5">
                  <InlineCodeText text={prop.description[locale]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
