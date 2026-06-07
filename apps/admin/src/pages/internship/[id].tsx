import {
  OpportunityEditPage,
  editLayout,
  type EditField,
} from "@/features/opportunity-edit-page";
import { getInternships } from "@/lib/api";

const fields: EditField[] = [
  { name: "namePost", label: "Название" },
  { name: "dateCreationPost", label: "Дата создания", type: "date" },
  { name: "organization", label: "Организация" },
  { name: "responsibilities", label: "Обязанности", type: "textarea" },
  { name: "link", label: "Ссылка на пост" },
  { name: "linkPDF", label: "Ссылка на файл" },
  { name: "fullText", label: "Описание", type: "textarea" },
];

const Page = () => (
  <OpportunityEditPage
    kind="internships"
    title="Стажировка"
    backHref="/internships"
    fields={fields}
    load={async (q) => {
      const r = await getInternships(q);
      return { items: r.internships, count: r.count };
    }}
  />
);

Page.getLayout = editLayout;
export default Page;
