import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { ReactQueryDevtools } from "react-query/devtools";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useRouter } from "next/router";
import { NavigationBar } from "../components/layouts/NavigationBar";
import { ThemeProvider } from "next-themes";
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  const { pathname } = useRouter();
  const authRoutes = ["/login", "/signup", "/verify/email"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        {!authRoute && <NavigationBar />}
        <div
          className={
            authRoute
              ? "dark:bg-gray-900 dark:text-gray-100 bg-amber-50"
              : "pt-16 dark:bg-gray-900 dark:text-gray-100  bg-amber-50 "
          }
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
