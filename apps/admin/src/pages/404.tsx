import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NotFound = () => (
  <>
    <Head>
      <title>404</title>
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="text-xl font-semibold text-slate-900">
        Страница не найдена
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Возможно, ссылка устарела или страница была перемещена.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        На главную
      </Link>
    </main>
  </>
);

export default NotFound;
