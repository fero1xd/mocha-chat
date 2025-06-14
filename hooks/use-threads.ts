import { api } from "@/convex/_generated/api";
import { Thread } from "@/convex/types";
import { betterJsonParse } from "@/lib/utils";
import { convexQuery, useConvexAuth } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const LOCAL_KEY = 'threads';

export function useThreads() {
    const { isAuthenticated } = useConvexAuth();
    const threadsFromLocal = betterJsonParse<Thread[]>(localStorage.getItem(LOCAL_KEY));
    const { data: threadsFromConvex } = useQuery(convexQuery(api.threads.getThreads, isAuthenticated ? {} : "skip"));

    useEffect(() => {
        if (threadsFromConvex) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(threadsFromConvex));
        }
    }, [threadsFromConvex])

    return threadsFromConvex ?? threadsFromLocal ?? [];
}