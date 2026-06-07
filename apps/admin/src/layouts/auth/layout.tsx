import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <header className="p-6">
          <Link
            href="/"
            className="inline-flex h-8 w-8 text-brand-600"
            aria-label="На главную"
          >
            <Logo />
          </Link>
        </header>
        {children}
      </div>

      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-12 lg:flex">
        <div className="max-w-md text-center text-white">
          <h2 className="text-3xl font-semibold leading-tight">
            Добро пожаловать
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100">
            Панель управления агрегатором грантов, стажировок, стипендий и
            конкурсов Opportunity Hub.
          </p>
        </div>
      </div>
    </main>
  );
};
