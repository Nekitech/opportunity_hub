import Head from "next/head";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  OpportunityList,
  type OppLoad,
} from "@/features/opportunity-list-page";
import { getCompetitions, getGrants, getInternships } from "@/lib/api";

const loadGrants: OppLoad = async (q) => {
  const r = await getGrants(q);
  return { items: r.grants, count: r.count };
};
const loadCompetitions: OppLoad = async (q) => {
  const r = await getCompetitions(q);
  return { items: r.competitions, count: r.count };
};
const loadInternships: OppLoad = async (q) => {
  const r = await getInternships(q);
  return { items: r.internships, count: r.count };
};

const Page = () => (
  <>
    <Head>
      <title>Архив</title>
    </Head>
    <PageContainer>
      <PageHeader
        title="Архив"
        description="Скрытые из каталога записи. Можно вернуть или удалить."
      />
      <Tabs defaultValue="grants">
        <TabsList>
          <TabsTrigger value="grants">Гранты</TabsTrigger>
          <TabsTrigger value="competitions">Конкурсы</TabsTrigger>
          <TabsTrigger value="internships">Стажировки</TabsTrigger>
        </TabsList>
        <TabsContent value="grants" className="mt-4">
          <OpportunityList
            kind="grants"
            editPrefix="/grant"
            searchPlaceholder="Поиск гранта"
            load={loadGrants}
            blackListed
          />
        </TabsContent>
        <TabsContent value="competitions" className="mt-4">
          <OpportunityList
            kind="competitions"
            editPrefix="/competition"
            searchPlaceholder="Поиск конкурса"
            load={loadCompetitions}
            blackListed
          />
        </TabsContent>
        <TabsContent value="internships" className="mt-4">
          <OpportunityList
            kind="internships"
            editPrefix="/internship"
            searchPlaceholder="Поиск стажировки"
            load={loadInternships}
            blackListed
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  </>
);

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
