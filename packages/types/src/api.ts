/** API request / response shapes shared between @repo/api and @repo/web */

import type { Grant, Competition, Internship } from "./entities";

export type PaginatedResponse<T> = {
    items: T[];
    count: number;
};

export type GrantsResponse = {
    grants: Grant[];
    count: number;
};

export type CompetitionsResponse = {
    competitions: Competition[];
    count: number;
};

export type InternshipsResponse = {
    internships: Internship[];
    count: number;
};

export type ListQueryParams = {
    take?: number;
    skip?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, unknown>;
    extended?: boolean;
};
