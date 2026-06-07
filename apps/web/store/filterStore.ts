import { create } from "zustand";
import type { OpportunityKind } from "@/lib/api";

export type SortBy = "newest" | "deadline_soon" | "deadline_late";

export type FilterState = {
    kind: OpportunityKind;
    search: string;
    directions: string[];
    deadlineFrom: string;
    sortBy: SortBy;
};

type FilterActions = {
    setKind: (kind: OpportunityKind) => void;
    setSearch: (search: string) => void;
    toggleDirection: (dir: string) => void;
    setDeadlineFrom: (date: string) => void;
    setSortBy: (sortBy: SortBy) => void;
    reset: () => void;
};

const initialState: FilterState = {
    kind: "grants",
    search: "",
    directions: [],
    deadlineFrom: "",
    sortBy: "newest",
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
    ...initialState,

    setKind: (kind) => set({ kind, directions: [], search: "", deadlineFrom: "", sortBy: "newest" }),
    setSearch: (search) => set({ search }),
    toggleDirection: (dir) =>
        set((s) => ({
            directions: s.directions.includes(dir)
                ? s.directions.filter((d) => d !== dir)
                : [...s.directions, dir],
        })),
    setDeadlineFrom: (deadlineFrom) => set({ deadlineFrom }),
    setSortBy: (sortBy) => set({ sortBy }),
    reset: () => set(initialState),
}));
