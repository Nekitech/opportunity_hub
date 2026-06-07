import Link from "next/link";
import { buttonClasses } from "@repo/ui";

export default function CtaSection() {
    return (
        <section className="bg-gray-50 py-24">
            <div className="mx-auto max-w-screen-xl px-6">
                <div className="reveal-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 px-8 py-16 text-center shadow-soft-xl sm:px-16 sm:py-20">
                    {/* Сетка + блик */}
                    <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-40" />
                    <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Готов найти свою возможность?
                        </h2>
                        <p className="mt-4 text-lg text-primary-50/90">
                            База обновляется ежедневно — свежие гранты и&nbsp;стажировки
                            уже ждут тебя.
                        </p>
                        <Link
                            href="/catalog"
                            className={buttonClasses({
                                variant: "inverse",
                                size: "lg",
                                className: "mt-10",
                            })}
                        >
                            Открыть каталог
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
