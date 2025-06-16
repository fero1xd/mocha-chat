import { CookiesProvider } from "react-cookie";
import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  ConvexProvider,
  ConvexProviderWithAuth,
  ConvexReactClient,
} from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthForConvex } from "@/hooks/use-auth";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),

      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

convexQueryClient.connect(queryClient);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CookiesProvider>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <ConvexProviderWithAuth client={convex} useAuth={useAuthForConvex}>
            {children}
          </ConvexProviderWithAuth>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConvexProvider>
    </CookiesProvider>
  );
}
