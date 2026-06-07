import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer, PageHeader } from "@/components/page-container";
import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/search-input";
import { AddUserDialog } from "@/components/add-user-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteUser, extractApiError, getUsers } from "@/lib/api";
import { qk } from "@/lib/query-keys";
import type { User } from "@/types";

const Page = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<User | null>(null);

  const where = useMemo(
    () => (search ? { name: { startsWith: search } } : {}),
    [search]
  );

  const query = useQuery({
    queryKey: qk.users({ skip: page * pageSize, take: pageSize, where }),
    queryFn: () => getUsers({ skip: page * pageSize, take: pageSize, where }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Пользователь удалён");
      setToDelete(null);
    },
    onError: (err) => toast.error(extractApiError(err, "Не удалось удалить")),
  });

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
      {
        accessorKey: "name",
        header: "Логин",
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {row.original.name}
          </span>
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        id: "role",
        header: "Роль",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.role?.name ?? row.original.roleId}
          </Badge>
        ),
      },
      {
        id: "blocked",
        header: "Статус",
        cell: ({ row }) =>
          row.original.blocked ? (
            <Badge variant="destructive">Заблокирован</Badge>
          ) : (
            <Badge className="bg-success text-success-foreground hover:bg-success/90">
              Активен
            </Badge>
          ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/user/${row.original.id}`} aria-label="Редактировать">
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setToDelete(row.original)}
              aria-label="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Пользователи</title>
      </Head>
      <PageContainer>
        <PageHeader
          title="Пользователи"
          description="Управление учётными записями и ролями"
          action={<AddUserDialog />}
        />
        <div className="mb-4">
          <SearchInput
            placeholder="Поиск по логину"
            onSearch={(v) => {
              setSearch(v);
              setPage(0);
            }}
          />
        </div>
        <DataTable
          columns={columns}
          data={query.data?.users ?? []}
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
          emptyMessage="Пользователи не найдены"
          getRowId={(row) => String(row.id)}
        />
      </PageContainer>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Удалить пользователя?"
        description={
          toDelete
            ? `Пользователь «${toDelete.name}» будет удалён безвозвратно.`
            : undefined
        }
        loading={deleteMutation.isPending}
        onConfirm={() => toDelete && deleteMutation.mutate(toDelete.id)}
      />
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
