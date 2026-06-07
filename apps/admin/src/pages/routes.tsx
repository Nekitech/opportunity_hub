import { useMemo, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getResources } from "@/lib/api";
import { qk } from "@/lib/query-keys";
import type { ResourceAccess } from "@/types";

const Page = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const query = useQuery({
    queryKey: qk.resources({ skip: page * pageSize, take: pageSize }),
    queryFn: () => getResources({ skip: page * pageSize, take: pageSize }),
  });

  const columns = useMemo<ColumnDef<ResourceAccess, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
      {
        accessorKey: "path",
        header: "Путь",
        cell: ({ row }) => (
          <code className="text-xs text-slate-900">{row.original.path}</code>
        ),
      },
      {
        id: "method",
        header: "Метод",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.method}</Badge>
        ),
      },
      {
        id: "role",
        header: "Роль",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.role?.name ?? row.original.roleId ?? "—"}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Доступы</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Доступы к ресурсам"
          description="Права ролей на API-эндпоинты"
        />
        <DataTable
          columns={columns}
          data={query.data?.resources_access ?? []}
          rowCount={query.data?.resources_access_count ?? 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(0);
          }}
          pageSizeOptions={[25, 50, 100]}
          isLoading={query.isLoading}
          isError={query.isError}
          emptyMessage="Нет записей"
          getRowId={(row) => String(row.id)}
        />
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
