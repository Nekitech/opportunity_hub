"use client";

import { useFilterStore, type SortBy } from "@/store/filterStore";

const options: { value: SortBy; label: string }[] = [
    { value: "newest",        label: "Сначала новые" },
    { value: "deadline_soon", label: "Дедлайн: скоро" },
    { value: "deadline_late", label: "Дедлайн: позже" },
];

export default function SortSelect() {
    const sortBy    = useFilterStore((s) => s.sortBy);
    const setSortBy = useFilterStore((s) => s.setSortBy);

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 shrink-0">Сортировка:</span>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-700
                           shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}
