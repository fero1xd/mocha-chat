import { jwtQueryOptions, sessionQueryOptions, verifyJwt } from "@/lib/auth/client";
import { betterJsonParse } from "@/lib/utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export function useUser() {
    const [{ jwt: localJwt }, setCookie] = useCookies<"jwt", {
        jwt?: string
    }>(["jwt"]);

    const { data: session, isPending: sessionPending, isError: sessionErr } = useQuery(sessionQueryOptions);

    const { data: jwt, isPending: jwtFetchPending, isError: jwtError } = useQuery(jwtQueryOptions);

    useEffect(() => {
        if (jwt && jwt !== localJwt) {
            setCookie("jwt", jwt, {
                httpOnly: false,
                path: "/",
                sameSite: "lax",
                maxAge: 172800
            });
        }
    }, [jwt])

    const { data: payload, isError: verifyErr } = useQuery({
        queryKey: ['verify-jwt', jwt],
        queryFn: !jwt ? skipToken : () => verifyJwt(jwt),
        enabled: !!jwt,
        retry: false,
        refetchOnWindowFocus: false
    })

    const decodedPayload = betterJsonParse<User>(atob(localJwt?.split('.')?.[1] ?? ""));
    if (decodedPayload) {
        // @ts-expect-error
        decodedPayload._safe = false;
    }

    const isError = sessionErr || jwtError || verifyErr
    return {
        user: isError ? null : (session?.user ?? payload ?? decodedPayload),
        realUser: session,
        isRealLoading: sessionPending || jwtFetchPending,
        isError
    }
}