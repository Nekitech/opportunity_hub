import {
  OpportunityListPage,
  opportunityLayout,
} from "@/features/opportunity-list-page";
import { getGrants } from "@/lib/api";

const Page = () => (
  <OpportunityListPage
    kind="grants"
    title="Гранты"
    description="Список грантов из всех источников"
    editPrefix="/grant"
    searchPlaceholder="Поиск гранта"
    load={async (q) => {
      const r = await getGrants(q);
      return { items: r.grants, count: r.count };
    }}
  />
);

Page.getLayout = opportunityLayout;
export default Page;
