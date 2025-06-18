import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";

export const getThreads = userQuery({
    handler: async (ctx) => {
        const threads = await ctx.db.query('threads').
            withIndex("by_userId", (q) =>
                q.eq("userId", ctx.user.subject)).
            collect();

        return threads.sort((x, y) => y.lastMessageAt - x.lastMessageAt);
    }
})

export const createThread = userMutation({
    args: {
        id: v.string(),
        title: v.string(),
        lastMessageAt: v.number()
    },
    handler: async (ctx, args) => {
        const { user } = ctx;
        return await ctx.db.insert("threads", {
            ...args,
            userId: user.subject,
            isStreaming: false,
        })
    }
})

export const updateThreadStreaming = userMutation({
    args: {
        isStreaming: v.boolean(),
        threadId: v.string(),
    },
    handler: async (ctx, { isStreaming, threadId }) => {
        const userId = ctx.user.subject;
        const thread = await
            ctx.db.query("threads").withIndex("by_thread_user_id", (q) => q.eq("id", threadId).eq("userId", userId)).unique();

        if (!thread) throw new Error("thread not found");

        await ctx.db.patch(thread._id, {
            isStreaming,
        })
    }
})


export const updateThreadTitle = userMutation({
    args: {
        title: v.string(),
        threadId: v.string(),
    },
    handler: async (ctx, { title, threadId }) => {
        const userId = ctx.user.subject;
        const thread = await
            ctx.db.query("threads").withIndex("by_thread_user_id", (q) => q.eq("id", threadId).eq("userId", userId)).unique();

        if (!thread) throw new Error("thread not found");

        await ctx.db.patch(thread._id, {
            title,
        })
    }
})