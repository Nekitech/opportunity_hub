import { useMemo, useState } from "react";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Play } from "lucide-react";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  extractApiError,
  getParsers,
  updateParser,
  runParser,
  setCronForAllParsers,
} from "@/lib/api";
import { qk } from "@/lib/query-keys";
import type { Parser } from "@/types";

const editSchema = z.object({
  description: z.string().optional(),
  pagesToParse: z.coerce.number().int().min(0),
  cronTime: z.string().optional(),
});
type EditValues = z.infer<typeof editSchema>;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ParserEditDialog({
  parser,
  onClose,
}: {
  parser: Parser | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    values: {
      description: parser?.description ?? "",
      pagesToParse: parser?.pagesToParse ?? 0,
      cronTime: parser?.cronTime ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: EditValues) =>
      updateParser({
        id: parser!.id,
        description: values.description,
        pagesToParse: values.pagesToParse,
        cronTime: values.cronTime,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parsers"] });
      toast.success("Парсер обновлён");
      onClose();
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <Dialog open={!!parser} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Парсер: {parser?.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pagesToParse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Страниц для парсинга</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cronTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron-расписание</FormLabel>
                  <FormControl>
                    <Input placeholder="0 0 * * *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Сохранение…" : "Сохранить"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const bulkCronSchema = z.object({
  cronTime: z.string().min(1, "Укажите cron-выражение"),
});
type BulkCronValues = z.infer<typeof bulkCronSchema>;

function BulkCronDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<BulkCronValues>({
    resolver: zodResolver(bulkCronSchema),
    values: { cronTime: "0 0 * * *" },
  });

  const mutation = useMutation({
    mutationFn: (values: BulkCronValues) =>
      setCronForAllParsers(values.cronTime),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["parsers"] });
      toast.success(data.message ?? "Расписание применено ко всем парсерам");
      onClose();
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cron-расписание для всех парсеров</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="cronTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron-выражение</FormLabel>
                  <FormControl>
                    <Input placeholder="0 0 * * *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Перезапишет расписание у <span className="font-medium">всех</span>{" "}
              парсеров. Включённые перепланируются сразу, без рестарта.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Применение…" : "Применить ко всем"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const Page = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [editing, setEditing] = useState<Parser | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const query = useQuery({
    queryKey: qk.parsers({ skip: page * pageSize, take: pageSize }),
    queryFn: () => getParsers({ skip: page * pageSize, take: pageSize }),
  });

  const toggleMutation = useMutation({
    mutationFn: (vars: { id: number; isEnabled: boolean }) =>
      updateParser(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parsers"] });
      toast.success("Статус обновлён");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const runMutation = useMutation({
    mutationFn: (id: number) => runParser(id),
    onSuccess: (data) => {
      toast.success(data.message ?? "Парсинг запущен");
      // Парсинг идёт асинхронно на бэке — обновим список чуть позже,
      // чтобы подтянуть свежий «Последний парсинг».
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["parsers"] });
        queryClient.invalidateQueries({ queryKey: qk.parserStats() });
      }, 4000);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const columns = useMemo<ColumnDef<Parser, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Имя",
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Описание",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        id: "isEnabled",
        header: "Активен",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isEnabled}
            onCheckedChange={(checked) =>
              toggleMutation.mutate({ id: row.original.id, isEnabled: checked })
            }
          />
        ),
      },
      {
        accessorKey: "pagesToParse",
        header: "Страниц",
        cell: ({ row }) => row.original.pagesToParse,
      },
      {
        accessorKey: "cronTime",
        header: "Cron",
        cell: ({ row }) => (
          <code className="text-xs text-muted-foreground">
            {row.original.cronTime || "—"}
          </code>
        ),
      },
      {
        id: "lastSuccessParse",
        header: "Последний парсинг",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.lastSuccessParse)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => runMutation.mutate(row.original.id)}
              aria-label="Запустить сейчас"
              title="Запустить сейчас"
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditing(row.original)}
              aria-label="Редактировать"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Head>
        <title>Парсеры</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Парсеры"
          description="Источники данных, их расписание и статус"
        />
        <div className="mb-4 flex justify-end">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            Cron для всех
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={query.data?.parsers ?? []}
          rowCount={query.data?.count ?? 0}
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
          emptyMessage="Парсеры не найдены"
          getRowId={(row) => String(row.id)}
        />
      </PageContainer>
      <ParserEditDialog parser={editing} onClose={() => setEditing(null)} />
      <BulkCronDialog open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
