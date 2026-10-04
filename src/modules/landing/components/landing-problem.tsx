import AppIcon from "@/components/general/app-icon";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LandingContainer } from "@/layouts/landing";

/**
 * Bảng "trước / sau".
 *
 * Bốn dòng là bốn khác biệt có thật giữa hai repo đang chạy, không phải ví dụ
 * dựng lên — đó là lý do khối này thuyết phục được người đọc là dev trong đội.
 */
export async function LandingProblem() {
  const { dict } = await getDictionary();
  const problem = dict.landing.problem;
  const rows = Object.values(problem.rows);

  return (
    <section className="border-b">
      <LandingContainer className="flex flex-col gap-8 py-16 md:py-20">
        <header className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {problem.title}
          </h2>
          <p className="text-base leading-7 text-pretty text-muted-foreground">{problem.subtitle}</p>
        </header>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">{problem.colAspect}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{problem.colBefore}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{problem.colAfter}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.aspect} className="border-b last:border-b-0">
                  <td className="px-4 py-3.5 font-medium whitespace-nowrap text-foreground">
                    {row.aspect}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <span className="flex items-start gap-2">
                      <AppIcon icon="x" className="mt-0.5 size-4 shrink-0 text-destructive/80" />
                      {row.before}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground">
                    <span className="flex items-start gap-2">
                      <AppIcon icon="check" className="mt-0.5 size-4 shrink-0 text-primary" />
                      {row.after}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LandingContainer>
    </section>
  );
}
