import axios from "axios";
import type {
  AppSettings,
  CompetitionsListResponse,
  GrantsListResponse,
  InternshipsListResponse,
  ListQuery,
  LoginResponse,
  LogsResponse,
  ParserStatsResponse,
  ParsersResponse,
  ResourcesResponse,
  Role,
  User,
  UsersResponse,
  WarningsResponse,
} from "@/types";

/**
 * Единый axios-клиент админки. Токен читается из sessionStorage
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ============================ auth ============================ */

export async function login(
  name: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/v1/users/login", {
    name,
    password,
  });
  return data;
}

/* ============================ users ============================ */

export async function getUsers(query: ListQuery = {}): Promise<UsersResponse> {
  const { data } = await apiClient.post<UsersResponse>("/v1/users/get", {
    skip: query.skip ?? 0,
    take: query.take ?? 10,
    where: query.where ?? {},
  });
  return data;
}

export async function addUser(payload: {
  name: string;
  email: string;
  password: string;
  role: number;
}): Promise<{ message?: string }> {
  const { data } = await apiClient.post("/v1/users", {
    ...payload,
    role_id: payload.role,
  });
  return data;
}

export async function updateUser(payload: {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  blocked?: boolean;
}): Promise<unknown> {
  const { data } = await apiClient.patch("/v1/users", payload);
  return data;
}

export async function deleteUser(id: number): Promise<unknown> {
  const { data } = await apiClient.delete("/v1/users", { data: { id } });
  return data;
}

export async function getRoles(): Promise<Role[]> {
  const { data } = await apiClient.post<Role[]>("/v1/roles", {});
  return data;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const { users } = await getUsers({ where: { id }, take: 1 });
  return users[0];
}

/* ============================ parsers ============================ */

export async function getParsers(
  query: ListQuery = {}
): Promise<ParsersResponse> {
  const { data } = await apiClient.post<ParsersResponse>("/v1/parsers", {
    skip: query.skip ?? 0,
    take: query.take ?? 50,
  });
  return data;
}

export async function updateParser(
  payload: { id: number } & Partial<{
    name: string;
    description: string;
    isEnabled: boolean;
    pagesToParse: number;
    cronTime: string;
  }>
): Promise<{ message?: string }> {
  const { data } = await apiClient.patch("/v1/parsers", payload);
  return data;
}

export async function getParserStats(): Promise<ParserStatsResponse> {
  const { data } = await apiClient.get<ParserStatsResponse>("/v1/parsers/stats");
  return data;
}

/* ============================ settings ============================ */

export async function getParsingSettings(): Promise<AppSettings> {
  const { data } = await apiClient.post<AppSettings>("/v1/settings", {});
  return data;
}

export async function updateParsingSettings(
  payload: Partial<Pick<AppSettings, "parsersWorkTimeStart" | "parsersWorkTimeEnd">>
): Promise<AppSettings> {
  const { data } = await apiClient.post<AppSettings>(
    "/v1/settings/update",
    payload
  );
  return data;
}

/* ============================ resources ============================ */

export async function getResources(
  query: ListQuery = {}
): Promise<ResourcesResponse> {
  const { data } = await apiClient.post<ResourcesResponse>(
    "/v1/resources/get",
    {
      skip: query.skip ?? 0,
      take: query.take ?? 50,
      where: query.where ?? {},
    }
  );
  return data;
}

/* ============================ logs ============================ */

export async function getLogs(query: ListQuery = {}): Promise<LogsResponse> {
  const { data } = await apiClient.post<LogsResponse>("/v1/accessing-logs", {
    skip: query.skip ?? 0,
    take: query.take ?? 25,
    where: query.where ?? {},
    orderBy: query.orderBy ?? { id: "desc" },
  });
  return data;
}

export async function getWarnings(
  where: Record<string, unknown> = {}
): Promise<WarningsResponse> {
  const { data } = await apiClient.post<WarningsResponse>(
    "/v1/accessing-logs/warnings",
    { where }
  );
  return data;
}

export async function updateWarning(payload: {
  id: number;
  isSolved: boolean;
}): Promise<unknown> {
  const { data } = await apiClient.post(
    "/v1/accessing-logs/warnings/update",
    { id: payload.id, data: { isSolved: payload.isSolved } }
  );
  return data;
}

/* ===================== opportunities (grants/…) ===================== */

export async function getGrants(
  query: ListQuery = {}
): Promise<GrantsListResponse> {
  const { data } = await apiClient.post<GrantsListResponse>("/v1/grants/", {
    skip: query.skip ?? 0,
    take: query.take ?? 10,
    where: query.where ?? {},
    orderBy: query.orderBy ?? { id: "desc" },
    extended: query.extended ?? true,
  });
  return data;
}

export async function getCompetitions(
  query: ListQuery = {}
): Promise<CompetitionsListResponse> {
  const { data } = await apiClient.post<CompetitionsListResponse>(
    "/v1/competitions/",
    {
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      where: query.where ?? {},
      orderBy: query.orderBy ?? { id: "desc" },
      extended: query.extended ?? true,
    }
  );
  return data;
}

export async function getInternships(
  query: ListQuery = {}
): Promise<InternshipsListResponse> {
  const { data } = await apiClient.post<InternshipsListResponse>(
    "/v1/internships/",
    {
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      where: query.where ?? {},
      orderBy: query.orderBy ?? { id: "desc" },
      extended: query.extended ?? true,
    }
  );
  return data;
}

export type OpportunityKind = "grants" | "competitions" | "internships";

export async function deleteOpportunity(
  kind: OpportunityKind,
  id: number
): Promise<unknown> {
  const { data } = await apiClient.delete(`/v1/${kind}`, { data: { id } });
  return data;
}

export async function updateOpportunity(
  kind: OpportunityKind,
  id: number,
  fields: Record<string, unknown>
): Promise<unknown> {
  const { data } = await apiClient.patch(`/v1/${kind}`, { id, data: fields });
  return data;
}

export async function getOpportunityById<T>(
  kind: OpportunityKind,
  id: number
): Promise<T> {
  const { data } = await apiClient.post<T>(`/v1/${kind}/${id}`, {});
  return data;
}

/** Извлекает читаемое сообщение из ошибки axios/валидации бэка */
export function extractApiError(err: unknown, fallback = "Произошла ошибка"): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.errors?.[0]?.msg;
    if (typeof msg === "string") return msg;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
