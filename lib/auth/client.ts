import { queryOptions } from "@tanstack/react-query";
import { User } from "better-auth";
import { createAuthClient } from "better-auth/react";
import { createRemoteJWKSet, jwtVerify } from "jose";

const url = `${process.env.NODE_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

export const authClient = createAuthClient({
  baseURL: url,
});

export async function verifyJwt(jwt: string) {
  try {
    const JWKS = createRemoteJWKSet(new URL(`${url}/api/auth/jwks`));
    const { payload } = await jwtVerify<User>(jwt, JWKS, {
      issuer: url,
      audience: url,
    });
    return payload;
  } catch (error) {
    console.error("Token validation failed:", error);
    throw error;
  }
}

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    let jwt: string | null = null;
    const session = await authClient.getSession({
      fetchOptions: {
        onSuccess: (ctx) => {
          const rjwt = ctx.response.headers.get("set-auth-jwt");
          jwt = rjwt;
        },
      },
    });
    if (!jwt) throw new Error("no jwt in session response");
    return { ...session.data, jwt: jwt as string };
  },
  retry: false,
  retryOnMount: false,
});

export const logout = () => {
  localStorage.removeItem("threads");
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
};
