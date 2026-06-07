import { useEffect, useState } from "react";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  extractApiError,
  getParsingSettings,
  updateParsingSettings,
} from "@/lib/api";
import { qk } from "@/lib/query-keys";

/** ISO -> "HH:mm" (UTC), и обратно. Время хранится как UTC-метка на 1970-01-01. */
const isoToTime = (iso?: string) => (iso ? iso.slice(11, 16) : "");
const timeToIso = (hhmm: string) => `1970-01-01T${hhmm}:00.000Z`;

const Page = () => {
  const queryClient = useQueryClient();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: qk.settings(),
    queryFn: getParsingSettings,
  });

  useEffect(() => {
    if (settings) {
      setStart(isoToTime(settings.parsersWorkTimeStart));
      setEnd(isoToTime(settings.parsersWorkTimeEnd));
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () =>
      updateParsingSettings({
        parsersWorkTimeStart: timeToIso(start),
        parsersWorkTimeEnd: timeToIso(end),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.settings() });
      toast.success("Настройки сохранены");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <>
      <Head>
        <title>Настройки</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Настройки"
          description="Параметры работы парсеров"
        />
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Расписание парсинга</CardTitle>
            <CardDescription>
              Окно времени (UTC), в которое разрешён запуск парсеров.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex gap-6">
                <Skeleton className="h-16 w-48" />
                <Skeleton className="h-16 w-48" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start">Начало</Label>
                  <Input
                    id="start"
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-48"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Окончание</Label>
                  <Input
                    id="end"
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || isLoading || !start || !end}
            >
              {mutation.isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </CardFooter>
        </Card>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
