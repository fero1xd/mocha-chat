import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/auth/db/index"; // your drizzle instance
import { bearer, createAuthMiddleware, jwt } from "better-auth/plugins"
import { betterFetch } from '@better-fetch/fetch';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    hooks: {
        /**
         * This hook sets the jwt cookie when user logs in
         */
        after: createAuthMiddleware(async ctx => {
            const sessionTokenName = ctx.context.authCookies.sessionToken.name;
            const cookies = ctx.context.responseHeaders?.getSetCookie();

            if (ctx.path.startsWith("/callback/:id") && ctx.context.newSession && cookies?.length) {
                const sessionToken = cookies.find(c => c.startsWith(sessionTokenName));
                const sessionValue = sessionToken?.slice(sessionTokenName.length + 1, sessionToken.indexOf(";"));

                const { data, error } = await betterFetch<{ token: string }>(`https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/auth/token`, {
                    headers: {
                        Authorization: `Bearer ${sessionValue}`
                    }
                })
                if (data) {
                    ctx.setCookie('jwt', data.token, {
                        httpOnly: false,
                        path: "/",
                        sameSite: "Lax",
                        maxAge: 60 * 60 * 24 * 2
                    })
                } else {
                    console.log({ error });
                }
            }

        })
    },
    plugins: [
        bearer(),
        jwt({
            jwt: {
                expirationTime: "2days",
            },
            jwks: {
                keyPairConfig: {
                    // only one supported by convex
                    alg: "RS256",
                }
            }
        })
    ]
});