import { customQuery, customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";

export class AuthError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

export const userQuery = customQuery(
    query, // The base function we're extending
    customCtx(async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new AuthError("Authentication required");
        return { user };
    })
);

export const userMutation = customMutation(
    mutation,
    customCtx(async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new AuthError("Authentication required");
        return { user };
    })
);