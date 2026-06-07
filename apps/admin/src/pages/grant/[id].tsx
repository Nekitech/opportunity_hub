import {
  OpportunityEditPage,
  editLayout,
  type EditField,
} from "@/features/opportunity-edit-page";
import { getGrants } from "@/lib/api";

const fields: EditField[] = [
  { name: "namePost", label: "Название" },
  { name: "dateCreationPost", label: "Дата создания", type: "date" },
  { name: "deadline", label: "Дедлайн", type: "date" },
  { name: "summary", label: "Сумма" },
  { name: "organization", label: "Организация" },
  { name: "directionForSpent", label: "Направление расходования" },
  { name: "link", label: "Ссылка на пост" },
  { name: "linkPDF", label: "Ссылка на файл" },
  { name: "fullText", label: "Описание", type: "textarea" },
];

const Page = () => (
  <OpportunityEditPage
    kind="grants"
    title="Грант"
    backHref="/grants"
    fields={fields}
    load={async (q) => {
      const r = await getGrants(q);
      return { items: r.grants, count: r.count };
    }}
  />
);

Page.getLayout = editLayout;
export default Page;
