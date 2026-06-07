"use client";

import { useEffect, useState } from "react";
import { useFilterStore } from "@/store/filterStore";

export default function SearchBar() {
    const setSearch = useFilterStore((s) => s.setSearch);
    const storeSearch = useFilterStore((s) => s.search);
    const [value, setValue] = useState(storeSearch);

    // Debounce 350ms before updating store
    useEffect(() => {
        const t = setTimeout(() => setSearch(value), 350);
        return () => clearTimeout(t);
    }, [value, setSearch]);

    // Sync if store was reset externally
    useEffect(() => {
        if (storeSearch === "") setValue("");
    }, [storeSearch]);

    return (
        <div className="relative">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
        </div>
    );
}
