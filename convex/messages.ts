import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { userMutation, userQuery } from "./helpers";
import { roleValidator } from "./schema";
import { api } from "./_generated/api";
import { internalQuery } from "./_generated/server";

export const getThreadMessages = userQuery({
    args: {
        threadId: v.string()
    },
    handler: async (ctx, { threadId }) => {
        const thread = await ctx.db.query('threads').withIndex('by_thread_user_id', (q) => q.eq('id', threadId).eq("userId", ctx.user.subject)).unique();
        if (!thread) throw new Error('no thread found');

        return await ctx.db.query("messages")
            .withIndex("by_thread_id",
                (q) => q.eq("threadId", threadId)
            ).collect();
    },
})

export const internalGetMessages = internalQuery({
    args: {
        threadId: v.string(),
    },
    handler: (ctx, { threadId }) => {
        return ctx.db.query('messages').withIndex('by_thread_id', (q) => q.eq("threadId", threadId)).collect()
    }
})

export const addMessagesToThread = userMutation({
    args: {
        threadId: v.string(),
        messages: v.array(v.object({
            id: v.string(),
            content: v.string(),
            role: roleValidator
        }))
    },
    handler: async (ctx, args) => {
        // Check if this user is allowed to add a message to this thread
        const thread = await ctx.db.query("threads").
            withIndex("by_thread_user_id", (q) => q.eq("id", args.threadId).eq("userId", ctx.user.subject)).unique();
        let threadId = thread?._id;

        if (!thread) {
            threadId = await ctx.runMutation(api.threads.createThread, {
                id: args.threadId,
                title: "New Thread",
                lastMessageAt: Date.now()
            })
        }

        for (const message of args.messages) {
            await ctx.db.insert('messages', {
                ...message,
                threadId: args.threadId,
            })
        }

        const lastMessageAt = Date.now();
        await ctx.db.patch(threadId!, {
            lastMessageAt
        })
    }
})

export const updateMessageContent = userMutation({
    args: {
        messageId: v.string(),
        threadId: v.string(),
        content: v.string(),
        reasoning: v.optional(v.string())
    },
    handler: async (ctx, { messageId, threadId, content, reasoning }) => {
        const message = await ctx.db.query("messages")
            .withIndex("by_message_id", (q) => q.eq("id", messageId))
            .unique()

        if (!message) throw new Error("message not found")

        const update: Partial<Doc<"messages">> = { content }
        if (reasoning) { update.reasoning = reasoning }

        await ctx.db.patch(message._id, update);
    }
})