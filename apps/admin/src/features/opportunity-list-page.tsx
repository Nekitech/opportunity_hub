import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Archive, ArchiveRestore, ExternalLink, Trash2 } from "lucide-react";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/search-input";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  deleteOpportunity,
  extractApiError,
  updateOpportunity,
  type OpportunityKind,
} from "@/lib/api";
import type { ListQuery } from "@/types";

export type OppItem = {
  id: number;
  namePost: string;
  link: string | null;
};

export type OppLoad = (
  q: ListQuery
) => Promise<{ items: OppItem[]; count: number }>;

/** Внутренний список без page-chrome — переиспользуется в страницах и в архиве (tabs). */
export function OpportunityList({
  kind,
  editPrefix,
  searchPlaceholder,
  load,
  blackListed = false,
}: {
  kind: OpportunityKind;
  editPrefix: string;
  searchPlaceholder: string;
  load: OppLoad;
  blackListed?: boolean;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<OppItem | null>(null);

  const where = useMemo(
    () => ({
      blackListed,
      ...(search ? { namePost: { contains: search } } : {}),
    }),
    [search, blackListed]
  );

  const query = useQuery({
    queryKey: [kind, blackListed, { skip: page * pageSize, take: pageSize, where }],
    queryFn: () => load({ skip: page * pageSize, take: pageSize, where }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [kind] });

  const archiveMutation = useMutation({
    mutationFn: (id: number) =>
      updateOpportunity(kind, id, { blackListed: !blackListed }),
    onSuccess: () => {
      invalidate();
      toast.success(blackListed ? "Возвращено из архива" : "Убрано в архив");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOpportunity(kind, id),
    onSuccess: () => {
      invalidate();
      toast.success("Удалено");
      setToDelete(null);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const columns = useMemo<ColumnDef<OppItem, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
      {
        accessorKey: "namePost",
        header: "Название",
        cell: ({ row }) => (
          <Link
            href={`${editPrefix}/${row.original.id}`}
            className="font-medium text-slate-900 hover:text-brand-600 hover:underline"
          >
            {row.original.namePost}
          </Link>
        ),
      },
      {
        id: "link",
        header: "Ссылка",
        cell: ({ row }) =>
          row.original.link ? (
            <a
              href={row.original.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
            >
              Источник <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
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
              title={blackListed ? "Вернуть из архива" : "В архив"}
              onClick={() => archiveMutation.mutate(row.original.id)}
            >
              {blackListed ? (
                <ArchiveRestore className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Удалить"
              onClick={() => setToDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editPrefix, blackListed]
  );

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder={searchPlaceholder}
        onSearch={(v) => {
          setSearch(v);
          setPage(0);
        }}
      />
      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        rowCount={query.data?.count ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(0);
        }}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyMessage="Ничего не найдено"
        getRowId={(row) => String(row.id)}
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Удалить запись?"
        description={
          toDelete ? `«${toDelete.namePost}» будет удалено.` : undefined
        }
        loading={deleteMutation.isPending}
        onConfirm={() => toDelete && deleteMutation.mutate(toDelete.id)}
      />
    </div>
  );
}

/** Готовая страница списка (грантов/конкурсов/стажировок). */
export function OpportunityListPage(props: {
  kind: OpportunityKind;
  title: string;
  description?: string;
  editPrefix: string;
  searchPlaceholder: string;
  load: OppLoad;
}) {
  const { title, description, ...rest } = props;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageContainer>
        <PageHeader title={title} description={description} />
        <OpportunityList {...rest} />
      </PageContainer>
    </>
  );
}

export const opportunityLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
