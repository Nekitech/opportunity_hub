/**
 * Admin-локальные типы сущностей (из Prisma-схемы apps/api) и форм ответов API.
 * Гранты/конкурсы/стажировки берём из @repo/types.
 */
import type { Grant, Competition, Internship } from "@repo/types";

export type { Grant, Competition, Internship };

export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role?: Role;
  blocked: boolean;
};

export type AccessingLog = {
  id: number;
  ip: string;
  date: string;
  method: string;
  path: string;
  userId: number | null;
  User?: Pick<User, "id" | "name"> | null;
};

export type Warning = {
  id: number;
  userId: number | null;
  date: string;
  description: string;
  type: string;
  isSolved: boolean;
  user?: Pick<User, "id" | "name"> | null;
};

export type ResourceAccess = {
  id: number;
  path: string;
  method: string;
  roleId: number | null;
  role?: Role | null;
};

export type Parser = {
  id: number;
  name: string;
  description: string | null;
  isEnabled: boolean;
  pagesToParse: number;
  cronTime: string | null;
  lastSuccessAdd: string | null;
  lastSuccessParse: string | null;
};

export type ParserStat = {
  id: number;
  name: string;
  description: string | null;
  isEnabled: boolean;
  cronTime: string | null;
  pagesToParse: number;
  lastSuccessParse: string | null;
  counts: {
    grants: number;
    competitions: number;
    internships: number;
    total: number;
  };
};

export type AppSettings = {
  id: number;
  parsersWorkTimeStart: string;
  parsersWorkTimeEnd: string;
};

/* ---- API response wrappers ---- */

export type ListResponse<K extends string, T> = {
  count: number;
} & { [P in K]: T[] };

export type UsersResponse = { users: User[]; count: number };
export type ParsersResponse = { parsers: Parser[]; count: number };
export type LogsResponse = { logs: AccessingLog[]; count: number };
export type WarningsResponse = { logs: Warning[]; count: number };
export type ResourcesResponse = {
  resources_access: ResourceAccess[];
  resources_access_count: number;
};
export type ParserStatsResponse = { stats: ParserStat[]; total: number };
export type CountResponse = { count: number };

export type LoginResponse = { token: string; user: User & { role: Role } };

export type GrantsListResponse = { grants: Grant[]; count: number };
export type CompetitionsListResponse = {
  competitions: Competition[];
  count: number;
};
export type InternshipsListResponse = {
  internships: Internship[];
  count: number;
};

/** Форма постранично-сортированного запроса к backend. */
export type ListQuery = {
  skip?: number;
  take?: number;
  where?: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
  extended?: boolean;
};

/** Стандартный конверт ошибки валидации backend. */
export type ApiErrorBody = {
  errors?: { msg: string }[];
};
