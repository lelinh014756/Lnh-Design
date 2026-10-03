'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { LocaleProvider } from '@/lib/i18n/context';
import { createBrowserQueryClient } from '@/lib/query/query-client';
import type { Locale } from '@/lib/i18n/types';

/**
 * Provider gốc phía client.
 *
 * QueryClient tạo trong `useState` để mỗi cây React giữ một instance —
 * tránh việc lần render đầu trên server dùng chung cache giữa các request.
 */
export function Providers({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [queryClient] = useState(createBrowserQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <LocaleProvider initialLocale={initialLocale}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
