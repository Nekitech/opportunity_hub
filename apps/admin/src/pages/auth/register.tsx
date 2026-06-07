import Head from "next/head";
import Link from "next/link";
import { Layout as AuthLayout } from "@/layouts/auth/layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => (
  <>
    <Head>
      <title>Регистрация</title>
    </Head>
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Регистрация</h1>
        <p className="text-sm text-muted-foreground">
          Самостоятельная регистрация отключена. Учётные записи создаёт
          администратор.
        </p>
        <Link href="/auth/login" className={cn(buttonVariants({ variant: "outline" }))}>
          К входу
        </Link>
      </div>
    </div>
  </>
);

Page.getLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;
export default Page;
