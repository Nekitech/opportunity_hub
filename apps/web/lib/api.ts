import axios from "axios";
import type {
    GrantsResponse,
    CompetitionsResponse,
    InternshipsResponse,
    ListQueryParams,
} from "@repo/types";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export type OpportunityKind = "grants" | "competitions" | "internships";

export type SortBy = "newest" | "deadline_soon" | "deadline_late";

export type FetchOpportunitiesParams = {
    kind: OpportunityKind;
    skip?: number;
    take?: number;
    search?: string;
    directions?: string[];
    deadlineFrom?: string;
    sortBy?: SortBy;
};

export function buildOrderBy(sortBy?: SortBy): Record<string, "asc" | "desc"> {
    switch (sortBy) {
        case "deadline_soon": return { deadline: "asc" };
        case "deadline_late": return { deadline: "desc" };
        default:              return { id: "desc" };
    }
}

export function buildWhere(params: FetchOpportunitiesParams) {
    const where: Record<string, unknown> = { blackListed: false };

    if (params.search) {
        where.namePost = { contains: params.search };
    }
    if (params.deadlineFrom) {
        where.deadline = { gte: params.deadlineFrom };
    }
    if (params.directions && params.directions.length > 0) {
        where.OR = params.directions.map((d) => ({
            directions: { contains: d },
        }));
    }

    return where;
}

export async function fetchGrants(
    params: FetchOpportunitiesParams
): Promise<GrantsResponse> {
    const body: ListQueryParams = {
        take: params.take ?? 12,
        skip: params.skip ?? 0,
        extended: true,
        orderBy: buildOrderBy(params.sortBy),
        where: buildWhere(params),
    };
    const { data } = await apiClient.post<GrantsResponse>("/v1/grants/", body);
    return data;
}

export async function fetchCompetitions(
    params: FetchOpportunitiesParams
): Promise<CompetitionsResponse> {
    const body: ListQueryParams = {
        take: params.take ?? 12,
        skip: params.skip ?? 0,
        extended: true,
        orderBy: buildOrderBy(params.sortBy),
        where: buildWhere(params),
    };
    const { data } = await apiClient.post<CompetitionsResponse>(
        "/v1/competitions/",
        body
    );
    return data;
}

export async function fetchInternships(
    params: FetchOpportunitiesParams
): Promise<InternshipsResponse> {
    const body: ListQueryParams = {
        take: params.take ?? 12,
        skip: params.skip ?? 0,
        extended: true,
        orderBy: buildOrderBy(params.sortBy),
        where: buildWhere(params),
    };
    const { data } = await apiClient.post<InternshipsResponse>(
        "/v1/internships/",
        body
    );
    return data;
}

export type DeadlineItem = {
    id: number;
    namePost: string;
    deadline: string;
    organization: string | null;
    kind: OpportunityKind;
};

export async function fetchUpcomingDeadlines(days = 90): Promise<DeadlineItem[]> {
    const today = new Date().toISOString().split("T")[0];
    const future = new Date(Date.now() + days * 86400_000).toISOString().split("T")[0];

    const where = {
        blackListed: false,
        deadline: { gte: today, lte: future },
    };
    const body = { take: 200, skip: 0, where, orderBy: { deadline: "asc" } };

    const [grants, competitions] = await Promise.all([
        apiClient.post<GrantsResponse>("/v1/grants/", body),
        apiClient.post<CompetitionsResponse>("/v1/competitions/", body),
    ]);

    const result: DeadlineItem[] = [
        ...(grants.data.grants ?? []).map((g) => ({
            id: g.id, namePost: g.namePost, deadline: g.deadline ?? "",
            organization: g.organization ?? null, kind: "grants" as const,
        })),
        ...(competitions.data.competitions ?? []).map((c) => ({
            id: c.id, namePost: c.namePost, deadline: c.deadline ?? "",
            organization: c.organization ?? null, kind: "competitions" as const,
        })),
    ];

    return result
        .filter((i) => i.deadline)
        .sort((a, b) => a.deadline.localeCompare(b.deadline));
}

export async function fetchGrantById(id: number) {
    const { data } = await apiClient.post(`/v1/grants/${id}`, {});
    return data;
}

export async function fetchCompetitionById(id: number) {
    const { data } = await apiClient.post(`/v1/competitions/${id}`, {});
    return data;
}

export async function fetchInternshipById(id: number) {
    const { data } = await apiClient.post(`/v1/internships/${id}`, {});
    return data;
}
