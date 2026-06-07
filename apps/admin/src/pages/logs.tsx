import { useMemo, useState } from "react";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { extractApiError, getLogs, getWarnings, updateWarning } from "@/lib/api";
import { qk } from "@/lib/query-keys";
import type { AccessingLog, Warning } from "@/types";

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Page = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const where = useMemo(
    () => ({ NOT: { path: "/v1/accessing-logs" } }),
    []
  );

  const logsQuery = useQuery({
    queryKey: qk.logs({ skip: page * pageSize, take: pageSize, where }),
    queryFn: () =>
      getLogs({
        skip: page * pageSize,
        take: pageSize,
        where,
        orderBy: { date: "desc" },
      }),
  });

  const warningsQuery = useQuery({
    queryKey: qk.warnings(),
    queryFn: () => getWarnings(),
  });

  const solveMutation = useMutation({
    mutationFn: (vars: { id: number; isSolved: boolean }) =>
      updateWarning(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings"] });
      toast.success("Статус обновлён");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const logColumns = useMemo<ColumnDef<AccessingLog, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
      {
        id: "date",
        header: "Дата",
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        id: "user",
        header: "Пользователь",
        cell: ({ row }) =>
          row.original.User?.name ?? row.original.userId ?? "—",
      },
      {
        id: "method",
        header: "Метод",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.method}</Badge>
        ),
      },
      {
        accessorKey: "path",
        header: "Путь",
        cell: ({ row }) => (
          <code className="text-xs text-muted-foreground">
            {row.original.path}
          </code>
        ),
      },
    ],
    []
  );

  const warningColumns = useMemo<ColumnDef<Warning, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
      {
        id: "date",
        header: "Дата",
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        id: "user",
        header: "Пользователь",
        cell: ({ row }) =>
          row.original.user?.name ?? row.original.userId ?? "—",
      },
      { accessorKey: "description", header: "Описание" },
      {
        id: "type",
        header: "Тип",
        cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
      },
      {
        id: "isSolved",
        header: "Решено",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isSolved}
            onCheckedChange={(checked) =>
              solveMutation.mutate({ id: row.original.id, isSolved: checked })
            }
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const warnings = warningsQuery.data?.logs ?? [];

  return (
    <>
      <Head>
        <title>Логи</title>
      </Head>
      <PageContainer>
        <PageHeader title="Логи" description="Журнал доступа и предупреждения" />

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Доступ</h3>
          <DataTable
            columns={logColumns}
            data={logsQuery.data?.logs ?? []}
            rowCount={logsQuery.data?.count ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(0);
            }}
            pageSizeOptions={[25, 50, 100]}
            isLoading={logsQuery.isLoading}
            isError={logsQuery.isError}
            emptyMessage="Логи отсутствуют"
            getRowId={(row) => String(row.id)}
          />
        </section>

        <section className="mt-10 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Предупреждения
          </h3>
          <DataTable
            columns={warningColumns}
            data={warnings}
            rowCount={warnings.length}
            page={0}
            pageSize={Math.max(warnings.length, 1)}
            onPageChange={() => undefined}
            isLoading={warningsQuery.isLoading}
            isError={warningsQuery.isError}
            emptyMessage="Предупреждений нет"
            getRowId={(row) => String(row.id)}
          />
        </section>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
