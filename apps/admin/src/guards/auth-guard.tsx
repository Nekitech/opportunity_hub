import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/contexts/auth-context";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Проверка авторизации только при монтировании — ручной редирект после
  // sign-out не должен повторно триггерить этот эффект.
  useEffect(() => {
    if (!router.isReady) return;
    if (ignore.current) return;
    ignore.current = true;

    const token =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("token")
        : null;

    if (!isAuthenticated && !token) {
      router
        .replace({
          pathname: "/auth/login",
          query:
            router.asPath !== "/"
              ? { continueUrl: router.asPath }
              : undefined,
        })
        .catch(console.error);
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!checked) return null;
  return <>{children}</>;
};
