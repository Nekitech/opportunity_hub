import { useRef, type ReactElement, type ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthConsumer, AuthProvider } from "@/contexts/auth-context";
import { useNProgress } from "@/hooks/use-nprogress";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
import "nprogress/nprogress.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = useRef(new QueryClient());
  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient.current}>
      <Head>
        <title>Админ-панель</title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <AuthProvider>
        <AuthConsumer>
          {(auth) =>
            auth.isLoading ? null : getLayout(<Component {...pageProps} />)
          }
        </AuthConsumer>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
