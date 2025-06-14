import { customQuery, customCtx } from "convex-helpers/server/customFunctions";
import { query } from "./_generated/server";

export const userQuery = customQuery(
    query, // The base function we're extending
    customCtx(async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Authentication required");
        return { user };
    })
);