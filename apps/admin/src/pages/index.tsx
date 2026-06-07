import { useMemo } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, GraduationCap, Radio, Trophy } from "lucide-react";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getParserStats } from "@/lib/api";
import { qk } from "@/lib/query-keys";

const PIE_COLORS = ["hsl(200 98% 39%)", "hsl(217 91% 60%)", "hsl(262 83% 58%)"];

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-semibold text-slate-900">
              {value.toLocaleString("ru-RU")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: qk.parserStats(),
    queryFn: getParserStats,
    staleTime: 60_000,
  });

  const totals = useMemo(() => {
    const stats = data?.stats ?? [];
    const grants = stats.reduce((s, p) => s + p.counts.grants, 0);
    const competitions = stats.reduce((s, p) => s + p.counts.competitions, 0);
    const internships = stats.reduce((s, p) => s + p.counts.internships, 0);
    const activeSources = stats.filter((p) => p.isEnabled).length;
    return { grants, competitions, internships, activeSources };
  }, [data]);

  const pieData = useMemo(
    () => [
      { name: "Гранты", value: totals.grants },
      { name: "Конкурсы", value: totals.competitions },
      { name: "Стажировки", value: totals.internships },
    ],
    [totals]
  );

  const barData = useMemo(
    () =>
      [...(data?.stats ?? [])]
        .sort((a, b) => b.counts.total - a.counts.total)
        .slice(0, 8)
        .map((p) => ({ name: p.name, value: p.counts.total })),
    [data]
  );

  return (
    <>
      <Head>
        <title>Дашборд</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Дашборд"
          description="Сводка по собранным возможностям и источникам"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Гранты"
            value={totals.grants}
            icon={FileText}
            loading={isLoading}
          />
          <StatCard
            title="Конкурсы"
            value={totals.competitions}
            icon={Trophy}
            loading={isLoading}
          />
          <StatCard
            title="Стажировки"
            value={totals.internships}
            icon={GraduationCap}
            loading={isLoading}
          />
          <StatCard
            title="Активных источников"
            value={totals.activeSources}
            icon={Radio}
            loading={isLoading}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Распределение по типам</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Топ источников по числу записей</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={barData}
                    margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "hsl(210 40% 96.1%)" }} />
                    <Bar
                      dataKey="value"
                      fill="hsl(200 98% 39%)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
