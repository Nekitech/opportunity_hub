import Head from "next/head";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const Page = () => {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>Аккаунт</title>
      </Head>
      <PageContainer>
        <PageHeader title="Аккаунт" description="Данные текущего пользователя" />
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{user?.name ?? "—"}</CardTitle>
            <CardDescription>{user?.email ?? ""}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Роль: {user?.role?.name ?? "—"}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
