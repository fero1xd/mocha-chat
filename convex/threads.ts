import { userQuery } from "./helpers";

export const getThreads = userQuery({
    handler: async (ctx) => {
        console.log({ user: ctx.user });
        return await ctx.db.query('threads').withIndex("by_last_message").order("desc").collect();
    }
})