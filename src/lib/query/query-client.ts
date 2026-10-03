"use client";

import { keepPreviousData, QueryClient } from "@tanstack/react-query";

// Browser-only QueryClient instance
let browserQueryClient: QueryClient | null = null;

// Module-specific cache durations
export const CACHE_DURATIONS = {
  // Lookup/Catalog - rarely change, load once
  LOOKUP: { staleTime: Infinity, gcTime: Infinity },
  // User Data - moderate change frequency
  USER_DATA: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30 },
  // Dashboard/Metrics - change frequently
  DASHBOARD: { staleTime: 1000 * 30, gcTime: 1000 * 60 * 10 },
} as const;

export type CacheDurationType = keyof typeof CACHE_DURATIONS;

/** Paginated admin list queries — retain rows while fetching next page/filter. */
export const LIST_QUERY_DEFAULTS = {
  placeholderData: keepPreviousData,
} as const;

function createBrowserQueryClient(): QueryClient {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          gcTime: 1000 * 60 * 10,
          retry: 1,
          refetchOnWindowFocus: true,
          refetchOnReconnect: "always",
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return browserQueryClient;
}

// Server-side QueryClient - new instance per request (SSR safe)
export function createServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnReconnect: "always",
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export { createBrowserQueryClient };