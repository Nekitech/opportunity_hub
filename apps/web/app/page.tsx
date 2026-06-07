import type { Metadata } from "next";
import { fetchSiteStats } from "@/lib/stats";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CtaSection from "@/components/landing/CtaSection";
import NavBar from "@/components/landing/NavBar";

export const metadata: Metadata = {
    title: "Opportunity Hub — гранты, стажировки, стипендии",
    description:
        "Агрегатор грантов, стажировок, стипендий и конкурсов из 50+ источников. Обновляется автоматически каждый день.",
    openGraph: {
        title: "Opportunity Hub — все гранты в одном месте",
        description:
            "50+ источников. Гранты, конкурсы, стажировки. Обновляется автоматически.",
        type: "website",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Opportunity Hub",
        description: "Все гранты и стажировки в одном месте",
    },
};

// Server component — fetch real stats at render time (ISR every 1h)
export const revalidate = 3600;

export default async function LandingPage() {
    const stats = await fetchSiteStats().catch(() => ({
        grants: 0,
        competitions: 0,
        internships: 0,
        total: 0,
        sources: 50,
    }));

    return (
        <>
            {/* NavBar overlays Hero */}
            <div className="relative">
                <NavBar />
                <HeroSection />
            </div>

            <main>
                <StatsSection stats={stats} />
                <HowItWorksSection />
                <CtaSection />
            </main>

            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
                    <span className="text-lg font-extrabold tracking-tight text-gray-900">
                        Opportunity<span className="text-primary-600">Hub</span>
                    </span>
                    <nav className="flex items-center gap-6 text-sm font-medium text-gray-500">
                        <a href="#how-it-works" className="transition-colors hover:text-primary-600">
                            Как работает
                        </a>
                        <a href="/catalog" className="transition-colors hover:text-primary-600">
                            Каталог
                        </a>
                    </nav>
                    <span className="text-sm text-gray-400">© 2026 Opportunity Hub</span>
                </div>
            </footer>
        </>
    );
}
