import type { SiteStats } from "@/lib/stats";

type Props = { stats: SiteStats };

const items = (s: SiteStats) => [
    {
        value: `${s.sources}+`,
        label: "источников данных",
        sub: "парсятся автоматически",
    },
    {
        value: s.total > 0 ? s.total.toLocaleString("ru") : "—",
        label: "возможностей в базе",
        sub: `${s.grants} грантов · ${s.competitions} конкурсов`,
    },
    {
        value: "24/7",
        label: "парсинг данных",
        sub: "без перерывов и выходных",
    },
];

export default function StatsSection({ stats }: Props) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-20">
            {/* Тонкая сетка-подложка */}
            <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative mx-auto max-w-screen-xl px-6">
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm sm:grid-cols-3">
                    {items(stats).map(({ value, label, sub }) => (
                        <div
                            key={label}
                            className="reveal-up bg-white/5 px-8 py-10 text-center transition-colors hover:bg-white/10"
                        >
                            <p className="text-5xl font-black tracking-tight text-white">
                                {value}
                            </p>
                            <p className="mt-3 text-base font-semibold text-primary-50">
                                {label}
                            </p>
                            <p className="mt-1 text-sm text-primary-100/80">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
