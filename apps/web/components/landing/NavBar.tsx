"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@repo/ui";

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "border-b border-gray-200/80 bg-white/80 shadow-soft backdrop-blur-xl"
                    : "border-b border-transparent bg-transparent"
            }`}
        >
            <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className={`text-xl font-extrabold tracking-tight transition-colors ${
                        scrolled ? "text-gray-900" : "text-white"
                    }`}
                >
                    Opportunity
                    <span className={scrolled ? "text-primary-600" : "text-primary-300"}>
                        Hub
                    </span>
                </Link>

                <nav
                    className={`hidden items-center gap-8 text-sm font-medium md:flex ${
                        scrolled ? "text-gray-600" : "text-white/80"
                    }`}
                >
                    <Link
                        href="#how-it-works"
                        className="transition-colors hover:text-primary-500 text-xl"
                    >
                        Как работает
                    </Link>
                    <Link
                        href="/catalog"
                        className="transition-colors hover:text-primary-500 text-xl"
                    >
                        Каталог
                    </Link>
                </nav>

                <Link
                    href="/catalog"
                    className={buttonClasses({
                        variant: scrolled ? "primary" : "glass",
                        size: "lg",
                    })}
                >
                    Перейти в каталог
                </Link>
            </div>
        </header>
    );
}
