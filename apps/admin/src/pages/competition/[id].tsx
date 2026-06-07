import {
  OpportunityEditPage,
  editLayout,
  type EditField,
} from "@/features/opportunity-edit-page";
import { getCompetitions } from "@/lib/api";

const fields: EditField[] = [
  { name: "namePost", label: "Название" },
  { name: "dateCreationPost", label: "Дата создания", type: "date" },
  { name: "deadline", label: "Дедлайн", type: "date" },
  { name: "organization", label: "Организация" },
  { name: "link", label: "Ссылка на пост" },
  { name: "linkPDF", label: "Ссылка на файл" },
  { name: "fullText", label: "Описание", type: "textarea" },
];

const Page = () => (
  <OpportunityEditPage
    kind="competitions"
    title="Конкурс"
    backHref="/competitions"
    fields={fields}
    load={async (q) => {
      const r = await getCompetitions(q);
      return { items: r.competitions, count: r.count };
    }}
  />
);

Page.getLayout = editLayout;
export default Page;
