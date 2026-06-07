import { describe, expect, test } from "@jest/globals";
import { buildOrderBy, buildWhere } from "../lib/api";

describe("buildOrderBy", () => {
    test("default → sort by id desc", () => {
        expect(buildOrderBy(undefined)).toEqual({ id: "desc" });
        expect(buildOrderBy("newest")).toEqual({ id: "desc" });
    });

    test("deadline_soon → deadline asc", () => {
        expect(buildOrderBy("deadline_soon")).toEqual({ deadline: "asc" });
    });

    test("deadline_late → deadline desc", () => {
        expect(buildOrderBy("deadline_late")).toEqual({ deadline: "desc" });
    });
});

describe("buildWhere", () => {
    const base = { kind: "grants" as const };

    test("always sets blackListed: false", () => {
        expect(buildWhere(base)).toMatchObject({ blackListed: false });
    });

    test("search adds namePost contains", () => {
        const w = buildWhere({ ...base, search: "РНФ" });
        expect(w).toMatchObject({ namePost: { contains: "РНФ" } });
    });

    test("empty search does not add namePost", () => {
        const w = buildWhere({ ...base, search: "" });
        expect(w).not.toHaveProperty("namePost");
    });

    test("deadlineFrom adds deadline gte", () => {
        const w = buildWhere({ ...base, deadlineFrom: "2026-06-01" });
        expect(w).toMatchObject({ deadline: { gte: "2026-06-01" } });
    });

    test("single direction adds OR clause", () => {
        const w = buildWhere({ ...base, directions: ["IT"] }) as any;
        expect(w.OR).toHaveLength(1);
        expect(w.OR[0]).toEqual({ directions: { contains: "IT" } });
    });

    test("multiple directions creates OR per direction", () => {
        const w = buildWhere({ ...base, directions: ["IT", "Медицина"] }) as any;
        expect(w.OR).toHaveLength(2);
    });

    test("empty directions does not add OR", () => {
        const w = buildWhere({ ...base, directions: [] });
        expect(w).not.toHaveProperty("OR");
    });

    test("combined search + deadline + directions", () => {
        const w = buildWhere({
            ...base,
            search: "грант",
            deadlineFrom: "2026-07-01",
            directions: ["Химия"],
        }) as any;
        expect(w.blackListed).toBe(false);
        expect(w.namePost).toEqual({ contains: "грант" });
        expect(w.deadline).toEqual({ gte: "2026-07-01" });
        expect(w.OR).toHaveLength(1);
    });
});
