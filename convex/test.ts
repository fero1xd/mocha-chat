import { query } from "./_generated/server";


export const testQuery = query({
    handler: async (ctx) => {
        const id = await ctx.auth.getUserIdentity()

        console.log({ id });
        if (!id) {
            throw new Error("no auth")
        }
        return [{
            id: 1
        }];
    }
})