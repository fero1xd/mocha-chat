import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";
import { internalMutation } from "./_generated/server";
import schema from "./schema";

export const getThreadMessages = userQuery({
    args: {
        threadId: v.string()
    },
    handler: (ctx, { threadId }) => {
        return ctx.db.query("messages")
            .withIndex("by_thread_user_id",
                (q) => q.eq("threadId", threadId)
                    .eq("userId", ctx.user.subject)
            ).collect();
    },
})

export const addMessageToThread = userMutation({
    args: {
        threadId: v.string(),
        content: v.string(),
        role: v.union(
            v.literal("user"),
            v.literal("assistant"),
            v.literal("data"),
            v.literal("system")
        ),
        parts: schema.tables.messages.validator.fields.parts,
    },
    handler: async (ctx, args) => {
        // Check if this user is allowed to add a message to this thread
        const thread = await ctx.db.query("threads").
            withIndex("by_thread_user_id", (q) => q.eq("id", args.threadId).eq("userId", ctx.user.subject)).unique();

        if (!thread) {
            throw new Error("no thread found");
        }

        const lastMessageAt = Date.now();
        await ctx.db.insert('messages', {
            ...args,
            userId: ctx.user.subject,
            // parts: [{
            //     type: "text",
            //     text: args.content
            // }]
        })

        await ctx.db.patch(thread._id, {
            lastMessageAt
        })
    }
})

export const updateMessageContent = internalMutation({
    args: {
        messageId: v.id("messages"),
        threadId: v.string(),
        userId: v.string(),
        content: v.string()
    },
    handler: async (ctx, { messageId, threadId, userId }) => {
        const message = await ctx.db.query("messages")
            .withIndex("by_id", (q) => q.eq("_id", messageId))
            .unique()

        if (!message) throw new Error("message not found")
    }
})