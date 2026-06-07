"use client";

import { useRef, useCallback } from "react";
import { useFilterStore } from "@/store/filterStore";
import { useInfiniteOpportunities } from "@/lib/queries";
import OpportunityCard from "./OpportunityCard";
import CardSkeleton from "./CardSkeleton";
import type { Grant, Competition, Internship } from "@repo/types";

type AnyItem = Grant | Competition | Internship;

type PageShape = { count: number; grants?: Grant[]; competitions?: Competition[]; internships?: Internship[] };

function flattenItems(pages: PageShape[]): AnyItem[] {
    return pages.flatMap(
        (page) => (page.grants ?? page.competitions ?? page.internships ?? []) as AnyItem[]
    );
}

export default function CatalogGrid() {
    const { kind, search, directions, deadlineFrom, sortBy } = useFilterStore();

    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteOpportunities({ kind, search, directions, deadlineFrom, sortBy });

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            if (!node || !hasNextPage) return;
            observerRef.current = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) fetchNextPage();
            });
            observerRef.current.observe(node);
        },
        [hasNextPage, fetchNextPage]
    );

    if (isError) {
        return (
            <div className="flex flex-col items-center py-20 text-center">
                <p className="text-gray-500">Не удалось загрузить данные.</p>
                <p className="text-sm text-gray-400">
                    Проверьте, что API сервер запущен.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const items = flattenItems((data?.pages ?? []) as PageShape[]);
    const total = data?.pages[0]?.count ?? 0;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center py-20 text-center">
                <p className="text-xl font-semibold text-gray-700">
                    Ничего не найдено
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    Попробуйте изменить фильтры или поисковый запрос
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400">
                Найдено: <span className="font-medium text-gray-600">{total}</span>
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <OpportunityCard key={item.id} item={item} kind={kind} />
                ))}
                {isFetchingNextPage &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={`skeleton-${i}`} />
                    ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-4" />
        </div>
    );
}
