"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFilterStore } from "@/store/filterStore";
import type { OpportunityKind } from "@/lib/api";

const KINDS: { value: OpportunityKind; label: string }[] = [
    { value: "grants", label: "Гранты" },
    { value: "competitions", label: "Конкурсы" },
    { value: "internships", label: "Стажировки" },
];

const DIRECTIONS = [
    "IT",
    "Биотехнологии",
    "Химия",
    "Медицина",
    "Экономика",
    "Дизайн",
    "Педагогика",
    "Журналистика",
];

const DEADLINE_PRESETS = [
    { label: "Неделя", days: 7 },
    { label: "Месяц", days: 30 },
    { label: "3 месяца", days: 90 },
];

function addDays(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().split("T")[0];
}

/** Содержимое фильтров — переиспользуется в desktop-сайдбаре и в мобильном drawer. */
function FilterContent() {
    const {
        kind,
        directions,
        deadlineFrom,
        setKind,
        toggleDirection,
        setDeadlineFrom,
        reset,
    } = useFilterStore();

    return (
        <div className="space-y-6">
            {/* Type tabs */}
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Тип
                </p>
                <div className="flex flex-col gap-1">
                    {KINDS.map((k) => (
                        <button
                            key={k.value}
                            onClick={() => setKind(k.value)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium text-left transition ${
                                kind === k.value
                                    ? "bg-primary-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                        >
                            {k.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Directions */}
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Направление
                </p>
                <div className="flex flex-wrap gap-2">
                    {DIRECTIONS.map((dir) => (
                        <button
                            key={dir}
                            onClick={() => toggleDirection(dir)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                directions.includes(dir)
                                    ? "border-primary-600 bg-primary-50 text-primary-700"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                            }`}
                        >
                            {dir}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deadline */}
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Дедлайн до
                </p>
                <div className="flex flex-wrap gap-2">
                    {DEADLINE_PRESETS.map(({ label, days }) => {
                        const val = addDays(days);
                        return (
                            <button
                                key={label}
                                onClick={() =>
                                    setDeadlineFrom(deadlineFrom === val ? "" : val)
                                }
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    deadlineFrom === val
                                        ? "border-primary-600 bg-primary-50 text-primary-700"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Reset */}
            {(directions.length > 0 || deadlineFrom) && (
                <button
                    onClick={reset}
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                >
                    Сбросить фильтры
                </button>
            )}

            {/* Calendar link */}
            <Link
                href="/calendar"
                className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:border-primary-300 hover:text-primary-700 transition"
            >
                <span>📅</span>
                <span>Календарь дедлайнов</span>
            </Link>
        </div>
    );
}

export default function CatalogFilters() {
    const [open, setOpen] = useState(false);
    const activeCount =
        useFilterStore((s) => s.directions.length) +
        (useFilterStore((s) => s.deadlineFrom) ? 1 : 0);

    // Блокируем скролл body и закрываем по Escape, пока drawer открыт.
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            {/* Mobile: кнопка-тоггл (первый ряд в колоночном layout) */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h18M6 12h12M10 20h4"
                    />
                </svg>
                Фильтры
                {activeCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-semibold text-white">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Desktop: статичный сайдбар */}
            <aside className="hidden shrink-0 lg:block lg:w-64">
                <FilterContent />
            </aside>

            {/* Mobile: off-canvas drawer */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* затемнение */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    {/* панель */}
                    <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-gray-50 shadow-soft-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">
                                Фильтры
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Закрыть"
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <FilterContent />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
