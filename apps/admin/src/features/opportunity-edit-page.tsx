import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  extractApiError,
  updateOpportunity,
  type OpportunityKind,
} from "@/lib/api";
import type { ListQuery } from "@/types";

export type EditField = {
  name: string;
  label: string;
  type?: "text" | "date" | "textarea";
};

type Row = Record<string, unknown> & { id: number };

const isoToDate = (v: unknown) =>
  typeof v === "string" && v.length >= 10 ? v.slice(0, 10) : "";

function parseDirections(v: unknown): string {
  if (typeof v !== "string" || !v) return "";
  try {
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.join(", ") : v;
  } catch {
    return v;
  }
}

export function OpportunityEditPage({
  kind,
  title,
  backHref,
  fields,
  load,
}: {
  kind: OpportunityKind;
  title: string;
  backHref: string;
  fields: EditField[];
  load: (q: ListQuery) => Promise<{ items: Row[]; count: number }>;
}) {
  const router = useRouter();
  const id = Number(router.query.id);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [directions, setDirections] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [kind, "detail", id],
    queryFn: () => load({ where: { id }, take: 1, skip: 0 }),
    enabled: Number.isFinite(id),
  });

  const row = data?.items?.[0];

  useEffect(() => {
    if (!row) return;
    const next: Record<string, string> = {};
    for (const f of fields) {
      const raw = row[f.name];
      next[f.name] =
        f.type === "date" ? isoToDate(raw) : raw == null ? "" : String(raw);
    }
    setForm(next);
    setDirections(parseDirections(row.directions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = { ...form };
      payload.directions = JSON.stringify(
        directions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
      return updateOpportunity(kind, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [kind] });
      toast.success("Сохранено");
      setEditing(false);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageContainer>
        <div className="mb-6 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <Link href={backHref} aria-label="Назад">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>

        <Card className="max-w-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="truncate">
              {isLoading ? "Загрузка…" : String(row?.namePost ?? "—")}
            </CardTitle>
            <Button
              variant={editing ? "secondary" : "default"}
              onClick={() => setEditing((e) => !e)}
              disabled={isLoading || !row}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {editing ? "Отменить" : "Редактировать"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">Ошибка загрузки</p>
            ) : (
              <>
                {fields.map((f) => (
                  <div key={f.name} className="space-y-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        id={f.name}
                        value={form[f.name] ?? ""}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, [f.name]: e.target.value }))
                        }
                        rows={6}
                      />
                    ) : (
                      <Input
                        id={f.name}
                        type={f.type === "date" ? "date" : "text"}
                        value={form[f.name] ?? ""}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, [f.name]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="directions">Направления (через запятую)</Label>
                  <Input
                    id="directions"
                    value={directions}
                    disabled={!editing}
                    onChange={(e) => setDirections(e.target.value)}
                  />
                </div>
                {editing && (
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => mutation.mutate()}
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Сохранение…" : "Сохранить"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}

export const editLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
