import type { ListQuery } from "@/types";

/**
 * Единая фабрика queryKey, чтобы ключи запросов и инвалидация не расходились
 * по строковым литералам в разных файлах.
 */
export const qk = {
  users: (query?: ListQuery) => ["users", query ?? {}] as const,
  user: (id: number) => ["users", "detail", id] as const,
  roles: () => ["roles"] as const,
  parsers: (query?: ListQuery) => ["parsers", query ?? {}] as const,
  parserStats: () => ["parser-stats"] as const,
  settings: () => ["parsing-settings"] as const,
  resources: (query?: ListQuery) => ["resources", query ?? {}] as const,
  logs: (query?: ListQuery) => ["logs", query ?? {}] as const,
  warnings: (where?: Record<string, unknown>) =>
    ["warnings", where ?? {}] as const,
  grants: (query?: ListQuery) => ["grants", query ?? {}] as const,
  competitions: (query?: ListQuery) => ["competitions", query ?? {}] as const,
  internships: (query?: ListQuery) => ["internships", query ?? {}] as const,
} as const;
