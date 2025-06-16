import { sessionQueryOptions, verifyJwt } from "@/lib/auth/client";
import { betterJsonParse } from "@/lib/utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";

export function useUser() {
    const [{ jwt: localJwt }, setCookie] = useCookies<"jwt", {
        jwt?: string
    }>(["jwt"]);

    const { data: session, isPending: sessionPending, isError: sessionErr } = useQuery(sessionQueryOptions);

    useEffect(() => {
        if (session?.jwt && session.jwt !== localJwt) {
            setCookie("jwt", session.jwt, {
                httpOnly: false,
                path: "/",
                sameSite: "lax",
                maxAge: 172800
            });
        }
    }, [session?.jwt])

    const { isError: verifyErr } = useQuery({
        queryKey: ['verify-jwt', localJwt],
        queryFn: !localJwt ? skipToken : () => verifyJwt(localJwt),
        enabled: !!localJwt,
        retry: false,
    })

    const decodedPayload =
        useMemo(() =>
            betterJsonParse<User>(atob(localJwt?.split('.')?.[1] ?? ""))
            , [localJwt])


    const isError = sessionErr || verifyErr
    return {
        user: isError ? null : (session?.user ?? decodedPayload),
        realUser: session?.user,
        isRealLoading: sessionPending,
        isError
    }
}