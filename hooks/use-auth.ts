import { useQueryClient } from "@tanstack/react-query";
import { ConvexProviderWithAuth } from "convex/react";
import { useCallback } from "react";
import { useUser } from "./use-jwt";
import { sessionQueryOptions } from "@/lib/auth/client";

export function useAuthForConvex(): ReturnType<
    React.ComponentProps<typeof ConvexProviderWithAuth>["useAuth"]
> {
    const queryClient = useQueryClient();

    const { user, isRealLoading, realUser } = useUser();

    const fetchAccessToken = useCallback(
        async (args: { forceRefreshToken: boolean }) => {
            console.log({ args });
            if (!user) return null;
            // if (args.forceRefreshToken) {
            //     return queryClient.fetchQuery(jwtQueryOptions);
            // }
            const data = await queryClient.ensureQueryData(sessionQueryOptions);
            return data.jwt;
        },
        [queryClient, user],
    );

    return {
        isLoading: isRealLoading,
        isAuthenticated: realUser !== null,
        fetchAccessToken,
    };
}