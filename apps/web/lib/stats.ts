import axios from "axios";

// Server-side: use internal Docker network URL if set, fall back to public URL
const BASE_URL =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000";

const api = axios.create({ baseURL: BASE_URL });

export type SiteStats = {
    grants: number;
    competitions: number;
    internships: number;
    total: number;
    sources: number;
};

export async function fetchSiteStats(): Promise<SiteStats> {
    const [grants, competitions, internships] = await Promise.allSettled([
        api.post<number>("/v1/grants/count", { where: { blackListed: false } }),
        api.post<number>("/v1/competitions/count", { where: { blackListed: false } }),
        api.post<number>("/v1/internships/count", { where: { blackListed: false } }),
    ]);

    const g = grants.status === "fulfilled" ? (grants.value.data as unknown as number) : 0;
    const c = competitions.status === "fulfilled" ? (competitions.value.data as unknown as number) : 0;
    const i = internships.status === "fulfilled" ? (internships.value.data as unknown as number) : 0;

    return {
        grants: g,
        competitions: c,
        internships: i,
        total: g + c + i,
        sources: 50,
    };
}
