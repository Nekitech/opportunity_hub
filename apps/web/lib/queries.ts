import {
    useQuery,
    useInfiniteQuery,
    type InfiniteData,
} from "@tanstack/react-query";
import {
    fetchGrants,
    fetchCompetitions,
    fetchInternships,
    fetchGrantById,
    fetchCompetitionById,
    fetchInternshipById,
    type FetchOpportunitiesParams,
    type OpportunityKind,
} from "./api";
import type {
    GrantsResponse,
    CompetitionsResponse,
    InternshipsResponse,
} from "@repo/types";

export const OPPORTUNITIES_PER_PAGE = 12;

export type CatalogParams = Omit<FetchOpportunitiesParams, "skip" | "take">;

/* ─── Infinite query: the catalog list ─────────────────────────────── */
export function useInfiniteOpportunities(params: CatalogParams) {
    return useInfiniteQuery<
        GrantsResponse | CompetitionsResponse | InternshipsResponse,
        Error,
        InfiniteData<GrantsResponse | CompetitionsResponse | InternshipsResponse>,
        [string, CatalogParams],
        number
    >({
        queryKey: ["opportunities", params],
        queryFn: ({ pageParam }) => {
            const fetchParams: FetchOpportunitiesParams = {
                ...params,
                skip: pageParam * OPPORTUNITIES_PER_PAGE,
                take: OPPORTUNITIES_PER_PAGE,
            };
            switch (params.kind) {
                case "grants":
                    return fetchGrants(fetchParams);
                case "competitions":
                    return fetchCompetitions(fetchParams);
                case "internships":
                    return fetchInternships(fetchParams);
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const fetched = allPages.length * OPPORTUNITIES_PER_PAGE;
            return fetched < lastPage.count ? allPages.length : undefined;
        },
        staleTime: 30 * 1000,
    });
}

/* ─── Single-item queries: detail page ─────────────────────────────── */
export function useOpportunityById(kind: OpportunityKind, id: number) {
    return useQuery({
        queryKey: ["opportunity", kind, id],
        queryFn: () => {
            switch (kind) {
                case "grants":
                    return fetchGrantById(id);
                case "competitions":
                    return fetchCompetitionById(id);
                case "internships":
                    return fetchInternshipById(id);
            }
        },
        enabled: id > 0,
    });
}
