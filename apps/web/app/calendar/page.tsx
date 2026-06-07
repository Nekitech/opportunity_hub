import type { Metadata } from "next";
import Link from "next/link";
import { fetchUpcomingDeadlines } from "@/lib/api";

export const metadata: Metadata = {
    title: "Календарь дедлайнов — Opportunity Hub",
    description: "Ближайшие дедлайны грантов и конкурсов",
};

export const revalidate = 1800; // 30 min

const kindLabel: Record<string, string> = {
    grants: "Грант",
    competitions: "Конкурс",
    internships: "Стажировка",
};
const kindColor: Record<string, string> = {
    grants: "bg-blue-100 text-blue-800",
    competitions: "bg-purple-100 text-purple-800",
    internships: "bg-green-100 text-green-800",
};

function groupByMonth(items: Awaited<ReturnType<typeof fetchUpcomingDeadlines>>) {
    const map = new Map<string, typeof items>();
    for (const item of items) {
        const d = new Date(item.deadline);
        const key = d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(item);
    }
    return map;
}

function daysLeft(deadline: string): number {
    return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400_000);
}

function DeadlineBadge({ days }: { days: number }) {
    if (days <= 0)  return <span className="text-xs font-semibold text-red-600">истёк</span>;
    if (days <= 3)  return <span className="text-xs font-semibold text-red-500">{days} д.</span>;
    if (days <= 14) return <span className="text-xs font-semibold text-orange-500">{days} д.</span>;
    return <span className="text-xs text-gray-400">{days} д.</span>;
}

export default async function CalendarPage() {
    const items = await fetchUpcomingDeadlines(90).catch(() => []);
    const grouped = groupByMonth(items);

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <header className="mb-8">
                <Link href="/catalog" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
                    ← Каталог
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Календарь дедлайнов</h1>
                <p className="mt-1 text-gray-500">Ближайшие 90 дней · {items.length} возможностей</p>
            </header>

            {items.length === 0 && (
                <p className="text-center text-gray-400 py-20">Нет данных о дедлайнах</p>
            )}

            <div className="space-y-10">
                {[...grouped.entries()].map(([month, monthItems]) => (
                    <section key={month}>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                            {month}
                        </h2>
                        <div className="space-y-2">
                            {monthItems.map((item) => {
                                const d = new Date(item.deadline);
                                const days = daysLeft(item.deadline);
                                return (
                                    <Link
                                        key={`${item.kind}-${item.id}`}
                                        href={`/catalog/${item.kind}-${item.id}`}
                                        className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary-200 transition"
                                    >
                                        {/* Day badge */}
                                        <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-2 text-center">
                                            <span className="text-xl font-black leading-none text-gray-800">
                                                {d.getDate()}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {d.toLocaleDateString("ru-RU", { month: "short" })}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${kindColor[item.kind]}`}>
                                                    {kindLabel[item.kind]}
                                                </span>
                                                <DeadlineBadge days={days} />
                                            </div>
                                            <p className="line-clamp-2 text-sm font-medium text-gray-900">
                                                {item.namePost}
                                            </p>
                                            {item.organization && (
                                                <p className="mt-0.5 truncate text-xs text-gray-400">
                                                    {item.organization}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
