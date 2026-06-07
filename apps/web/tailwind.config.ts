import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Полная sky-шкала (бело-сине-серая айдентика).
                // Раньше были только 50/100/500/600/700 — из-за чего
                // primary-200/300/900 в разметке были мёртвыми классами.
                primary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                    950: "#082f49",
                },
            },
            fontFamily: {
                sans: [
                    "var(--font-sans)",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif",
                ],
            },
            // Мягкие, многослойные, slate-тонированные тени вместо «рваного» чёрного shadow-xl.
            boxShadow: {
                soft: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
                "soft-md": "0 2px 4px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.08)",
                "soft-lg": "0 4px 8px rgba(15,23,42,0.05), 0 16px 48px rgba(15,23,42,0.10)",
                "soft-xl": "0 8px 16px rgba(15,23,42,0.06), 0 24px 64px rgba(15,23,42,0.14)",
                // Сине-тонированное «свечение» под primary-кнопки/акценты.
                glow: "0 6px 24px rgba(2,132,199,0.22)",
                "glow-lg": "0 10px 36px rgba(2,132,199,0.32)",
            },
            borderRadius: {
                "3xl": "1.5rem",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
                "fade-in": "fade-in 0.8s ease-out both",
                float: "float 6s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};

export default config;
