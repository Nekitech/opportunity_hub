import * as React from "react";

type Variant = "blue" | "purple" | "green" | "orange" | "gray";

const variants: Record<Variant, string> = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-700",
};

type Props = {
    variant?: Variant;
    children: React.ReactNode;
    className?: string;
};

export function Badge({ variant = "gray", children, className = "" }: Props) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
