import {
  OpportunityListPage,
  opportunityLayout,
} from "@/features/opportunity-list-page";
import { getInternships } from "@/lib/api";

const Page = () => (
  <OpportunityListPage
    kind="internships"
    title="Стажировки"
    description="Список стажировок из всех источников"
    editPrefix="/internship"
    searchPlaceholder="Поиск стажировки"
    load={async (q) => {
      const r = await getInternships(q);
      return { items: r.internships, count: r.count };
    }}
  />
);

Page.getLayout = opportunityLayout;
export default Page;
