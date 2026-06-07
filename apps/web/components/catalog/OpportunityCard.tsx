"use client";

import Link from "next/link";
import type { Grant, Competition, Internship } from "@repo/types";
import type { OpportunityKind } from "@/lib/api";

type Item = Grant | Competition | Internship;

type Props = {
    item: Item;
    kind: OpportunityKind;
};

const kindLabel: Record<OpportunityKind, string> = {
    grants: "Грант",
    competitions: "Конкурс",
    internships: "Стажировка",
};

const kindColor: Record<OpportunityKind, string> = {
    grants: "bg-blue-100 text-blue-800",
    competitions: "bg-purple-100 text-purple-800",
    internships: "bg-green-100 text-green-800",
};

function formatDeadline(d: string | null): string | null {
    if (!d) return null;
    const date = new Date(d);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function isDeadlineSoon(d: string | null): boolean {
    if (!d) return false;
    const days = (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 14;
}

export default function OpportunityCard({ item, kind }: Props) {
    const deadline = "deadline" in item ? item.deadline : null;
    const summary = "summary" in item ? item.summary : null;

    return (
        <Link
            href={`/catalog/${kind}-${item.id}`}
            className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-primary-300"
        >
            {/* Badge + deadline */}
            <div className="flex items-center justify-between gap-2">
                <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${kindColor[kind]}`}
                >
                    {kindLabel[kind]}
                </span>
                {deadline && (
                    <span
                        className={`text-xs font-medium ${
                            isDeadlineSoon(deadline)
                                ? "text-red-600"
                                : "text-gray-400"
                        }`}
                    >
                        до {formatDeadline(deadline)}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-gray-900 group-hover:text-primary-700">
                {item.namePost}
            </h3>

            {/* Summary / organization */}
            {summary && (
                <p className="line-clamp-2 text-xs text-gray-500">{summary}</p>
            )}
            {item.organization && (
                <p className="mt-auto text-xs text-gray-400 truncate">
                    {item.organization}
                </p>
            )}
        </Link>
    );
}
