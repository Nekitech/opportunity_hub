"use client";

import Link from "next/link";
import { useOpportunityById } from "@/lib/queries";
import type { OpportunityKind } from "@/lib/api";
import type { Grant, Competition, Internship } from "@repo/types";

type AnyItem = Grant | Competition | Internship;

const kindLabel: Record<OpportunityKind, string> = {
    grants: "Грант",
    competitions: "Конкурс",
    internships: "Стажировка",
};

function formatDate(d: string | null | undefined): string {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

type Props = { kind: OpportunityKind; id: number };

export default function OpportunityDetailClient({ kind, id }: Props) {
    const { data, isLoading, isError } = useOpportunityById(kind, id);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 space-y-4 animate-pulse">
                <div className="h-6 w-48 rounded bg-gray-200" />
                <div className="h-8 w-full rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <p className="text-gray-500">Не удалось загрузить данные.</p>
                <Link href="/catalog" className="mt-4 inline-block text-primary-600 hover:underline">
                    ← Назад в каталог
                </Link>
            </div>
        );
    }

    const item = data as AnyItem;
    const deadline = "deadline" in item ? item.deadline : null;
    const summary = "summary" in item ? item.summary : null;

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
            <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
                ← Назад в каталог
            </Link>

            {/* Badge */}
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {kindLabel[kind]}
            </span>

            <h1 className="text-2xl font-bold leading-snug text-gray-900">
                {item.namePost}
            </h1>

            {/* Meta */}
            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-4 text-sm">
                {item.organization && (
                    <>
                        <dt className="text-gray-400">Организация</dt>
                        <dd className="font-medium text-gray-800">{item.organization}</dd>
                    </>
                )}
                {deadline && (
                    <>
                        <dt className="text-gray-400">Дедлайн</dt>
                        <dd className="font-medium text-red-600">{formatDate(deadline)}</dd>
                    </>
                )}
                {summary && (
                    <>
                        <dt className="text-gray-400">Сумма / условия</dt>
                        <dd className="font-medium text-gray-800">{summary}</dd>
                    </>
                )}
                {item.sourceLink && (
                    <>
                        <dt className="text-gray-400">Источник</dt>
                        <dd>
                            <a
                                href={item.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline truncate block max-w-xs"
                            >
                                Открыть
                            </a>
                        </dd>
                    </>
                )}
                {item.link && (
                    <>
                        <dt className="text-gray-400">Ссылка</dt>
                        <dd>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline truncate block max-w-xs"
                            >
                                Подробнее
                            </a>
                        </dd>
                    </>
                )}
            </dl>

            {/* Full text */}
            {item.fullText && (
                <div className="prose prose-sm max-w-none text-gray-700">
                    <h2 className="text-base font-semibold">Описание</h2>
                    <p className="whitespace-pre-line">{item.fullText}</p>
                </div>
            )}
        </div>
    );
}
