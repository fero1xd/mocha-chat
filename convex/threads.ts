import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";
import { internal } from "./_generated/api";
import { internalQuery } from "./_generated/server";

export const getThreadForUser = internalQuery({
    args: {
        threadId: v.string(),
        userId: v.string()
    },
    handler: async (ctx, { threadId, userId }) => {
        const thread = await
            ctx.db.query("threads").withIndex("by_thread_user_id",
                (q) => q.eq("id", threadId).eq("userId", userId)).unique();

        if (!thread) throw new Error("internal: no thread found");

        return thread;
    }
})

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
        const existingThread = await ctx.db.query('threads').withIndex('by_thread_id', (q) => q.eq("id", args.id)).unique();
        if (existingThread) throw new Error(`cant create thread with id:${args.id}`)

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

export const deleteThread = userMutation({
    args: {
        threadId: v.string(),
    },
    handler: async (ctx, { threadId }) => {
        const thread = await ctx.db.query('threads').withIndex('by_thread_user_id',
            (q) => q.eq("id", threadId)
                .eq("userId", ctx.user.subject)
        ).unique()
        if (!thread) throw new Error("thread not found");

        await ctx.db.delete(thread._id);

        // Delete all messages with this thread id
        // should have been its own mutation
        const messages = await ctx.runQuery(internal.messages.internalGetMessages, {
            threadId: thread.id
        });

        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
    }
})

export const setThreadPin = userMutation({
    args: {
        threadId: v.string(),
        pin: v.boolean(),
    },
    handler: async (ctx, { threadId, pin }) => {
        const thread = await ctx.runQuery(internal.threads.getThreadForUser, {
            threadId,
            userId: ctx.user.subject
        })

        await ctx.db.patch(thread._id, {
            pinned: pin
        })
    }
})