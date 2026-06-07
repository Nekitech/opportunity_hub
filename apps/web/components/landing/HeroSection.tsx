"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { buttonClasses } from "@repo/ui";

const HeroAnimation = dynamic(() => import("./HeroAnimation"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900" />
    ),
});

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[92vh] items-center overflow-hidden">
            {/* Three.js background */}
            <div className="absolute inset-0 -z-10">
                <HeroAnimation />
            </div>

            {/* Затемнение для читаемости текста */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

            <div className="relative mx-auto w-full max-w-screen-xl px-6 py-28 sm:py-36">
                <div className="max-w-3xl">
                    {/* Eyebrow */}
                    <p className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 shadow-soft backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                        </span>
                        Обновляется автоматически 24/7
                    </p>

                    {/* Headline */}
                    <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.05] tracking-tight text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl">
                        Все гранты и&nbsp;стажировки
                        <br />
                        <span className="bg-gradient-to-r from-primary-300 via-primary-200 to-white bg-clip-text text-transparent">
                            в&nbsp;одном месте
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/80 [animation-delay:160ms]">
                        Агрегируем возможности из&nbsp;50+ источников — гранты, конкурсы,
                        стажировки и&nbsp;стипендии. Не&nbsp;пропусти дедлайн.
                    </p>

                    {/* CTA */}
                    <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
                        <Link
                            href="/catalog"
                            className={buttonClasses({
                                variant: "primary",
                                size: "lg",
                                className: "group",
                            })}
                        >
                            Смотреть возможности
                            <svg
                                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
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
                        <a
                            href="#how-it-works"
                            className={buttonClasses({ variant: "glass", size: "lg" })}
                        >
                            Как это работает
                        </a>
                    </div>
                </div>
            </div>

            {/* Плавное затухание к следующей секции */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent" />
        </section>
    );
}
