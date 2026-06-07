import { useMemo } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getParserStats } from "@/lib/api";
import { qk } from "@/lib/query-keys";
import type { ParserStat } from "@/types";

function daysSince(value: string | null) {
  if (!value) return null;
  return Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
}

function StatusBadge({ stat }: { stat: ParserStat }) {
  if (!stat.isEnabled) return <Badge variant="outline">Отключён</Badge>;
  const days = daysSince(stat.lastSuccessParse);
  if (days === null)
    return <Badge variant="secondary">Не запускался</Badge>;
  if (days <= 1)
    return (
      <Badge className="bg-success text-success-foreground hover:bg-success/90">
        Активен
      </Badge>
    );
  if (days <= 7) return <Badge variant="secondary">{days} дн. назад</Badge>;
  return <Badge variant="destructive">{days} дн. назад</Badge>;
}

const Page = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: qk.parserStats(),
    queryFn: getParserStats,
    staleTime: 60_000,
  });

  const stats = useMemo(
    () => [...(data?.stats ?? [])].sort((a, b) => b.counts.total - a.counts.total),
    [data]
  );

  const columns = useMemo<ColumnDef<ParserStat, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Источник",
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {row.original.name}
          </span>
        ),
      },
      {
        id: "total",
        header: "Всего",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.counts.total}</span>
        ),
      },
      {
        id: "grants",
        header: "Гранты",
        cell: ({ row }) => row.original.counts.grants,
      },
      {
        id: "competitions",
        header: "Конкурсы",
        cell: ({ row }) => row.original.counts.competitions,
      },
      {
        id: "internships",
        header: "Стажировки",
        cell: ({ row }) => row.original.counts.internships,
      },
      {
        id: "status",
        header: "Статус",
        cell: ({ row }) => <StatusBadge stat={row.original} />,
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Статистика источников</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Статистика источников"
          description="Количество собранных возможностей по каждому парсеру"
        />
        <DataTable
          columns={columns}
          data={stats}
          rowCount={stats.length}
          page={0}
          pageSize={Math.max(stats.length, 1)}
          onPageChange={() => undefined}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="Нет данных"
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
