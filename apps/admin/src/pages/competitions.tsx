import {
  OpportunityListPage,
  opportunityLayout,
} from "@/features/opportunity-list-page";
import { getCompetitions } from "@/lib/api";

const Page = () => (
  <OpportunityListPage
    kind="competitions"
    title="Конкурсы"
    description="Список конкурсов из всех источников"
    editPrefix="/competition"
    searchPlaceholder="Поиск конкурса"
    load={async (q) => {
      const r = await getCompetitions(q);
      return { items: r.competitions, count: r.count };
    }}
  />
);

Page.getLayout = opportunityLayout;
export default Page;
