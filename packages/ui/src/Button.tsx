import * as React from "react";

type Variant = "primary" | "outline" | "ghost" | "glass" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
    "inline-flex items-center justify-center gap-2 font-semibold leading-none " +
    "transition-all duration-200 ease-out select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<Variant, string> = {
    primary:
        "bg-primary-600 text-white shadow-glow hover:bg-primary-700 " +
        "hover:shadow-glow-lg hover:-translate-y-0.5 focus-visible:ring-primary-400",
    outline:
        "border border-gray-200 bg-white text-gray-800 shadow-soft " +
        "hover:border-gray-300 hover:bg-gray-50 hover:shadow-soft-md hover:-translate-y-0.5 " +
        "focus-visible:ring-gray-300",
    ghost:
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300",
    // Стеклянная кнопка для тёмного фона (Hero, прозрачный навбар).
    glass:
        "border border-white/30 bg-white/10 text-white backdrop-blur-md " +
        "hover:bg-white/20 hover:-translate-y-0.5 focus-visible:ring-white/60",
    // Инверсная — белая на цветном фоне (CTA-секция).
    inverse:
        "bg-white text-primary-700 shadow-soft-lg " +
        "hover:bg-primary-50 hover:text-primary-800 hover:-translate-y-0.5 focus-visible:ring-white/70",
};

// Заметно больше горизонтального воздуха, чтобы текст не липнул к границам.
const sizeClass: Record<Size, string> = {
    sm: "h-9 px-4 text-sm rounded-lg",
    md: "h-11 px-6 text-sm rounded-xl",
    lg: "h-14 px-8 text-base rounded-2xl",
};

/**
 * Возвращает класс-строку кнопки. Используй на ссылках
 * (`<Link className={buttonClasses(...)}>`), чтобы не получать невалидную
 * вложенность <a><button> (и связанные hydration-предупреждения).
 */
export function buttonClasses(opts: {
    variant?: Variant;
    size?: Size;
    className?: string;
} = {}): string {
    const { variant = "primary", size = "md", className = "" } = opts;
    return `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`;
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
};

export function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: Props) {
    return (
        <button className={buttonClasses({ variant, size, className })} {...props}>
            {children}
        </button>
    );
}
