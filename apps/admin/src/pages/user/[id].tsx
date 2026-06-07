import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import { PageContainer } from "@/components/page-container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractApiError, getRoles, getUserById, updateUser } from "@/lib/api";
import { qk } from "@/lib/query-keys";

const Page = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [password, setPassword] = useState("");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: qk.user(id),
    queryFn: () => getUserById(id),
    enabled: Number.isFinite(id),
  });

  const { data: roles } = useQuery({
    queryKey: qk.roles(),
    queryFn: getRoles,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRoleId(String(user.roleId));
      setBlocked(user.blocked);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: () =>
      updateUser({
        id,
        name,
        email,
        role_id: Number(roleId),
        blocked,
        ...(password ? { password } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Пользователь обновлён");
      setPassword("");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <>
      <Head>
        <title>Пользователь</title>
      </Head>
      <PageContainer>
        <div className="mb-6 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <Link href="/customers" aria-label="Назад">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Пользователь
          </h2>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{isLoading ? "Загрузка…" : user?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">Ошибка загрузки</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Логин</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Новый пароль (опционально)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Оставьте пустым, чтобы не менять"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Роль</Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles ?? []).map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="text-sm font-medium">Заблокирован</p>
                    <p className="text-xs text-muted-foreground">
                      Запретить вход пользователю
                    </p>
                  </div>
                  <Switch checked={blocked} onCheckedChange={setBlocked} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Сохранение…" : "Сохранить"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
