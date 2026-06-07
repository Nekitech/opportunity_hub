import Head from "next/head";
import Link from "next/link";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => (
  <>
    <Head>
      <title>Скрытые записи</title>
    </Head>
    <PageContainer>
      <PageHeader
        title="Скрытые записи"
        description="Управление скрытыми записями перенесено в раздел «Архив»."
      />
      <Link href="/archive" className={cn(buttonVariants())}>
        Перейти в архив
      </Link>
    </PageContainer>
  </>
);

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
