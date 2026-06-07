import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

// Self-hosted Inter с системным фолбэком (см. fontFamily в tailwind.config.ts).
const sans = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Opportunity Hub — гранты, стажировки, стипендии",
    description:
        "Агрегатор грантов, стажировок, стипендий и конкурсов. Более 50 источников, обновляется автоматически.",
    openGraph: {
        title: "Opportunity Hub",
        description: "Все гранты и стажировки в одном месте",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru" className={sans.variable} suppressHydrationWarning>
            <body className="font-sans" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
