import { useAuthForConvex } from "@/hooks/use-auth";
import { useModals } from "@/stores/use-modals";
import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ConvexProvider,
  ConvexProviderWithAuth,
  ConvexReactClient,
} from "convex/react";
import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),

      refetchOnWindowFocus: false,
      refetchOnMount: false,

      retry: 2,
    },
  },
  mutationCache: new MutationCache({
    onError(error, variables, context, mutation) {
      console.log({ mutation, error: error.message });
      const { showAuthModal } =
        mutation.meta ?? ({} as { showAuthModal?: boolean });
      if (showAuthModal) {
        useModals.getState().setAuth(true);
      }
    },
  }),
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
