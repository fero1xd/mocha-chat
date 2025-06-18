import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roleValidator = v.union(
    v.literal("user"),
    v.literal("assistant"),
    v.literal("data"),
    v.literal("system")
);

const schema = defineSchema({
    threads: defineTable({
        id: v.string(),
        title: v.string(),
        userId: v.string(),
        lastMessageAt: v.number(),
        isStreaming: v.boolean(),
    })
        .index("by_userId", ["userId"])
        .index("by_thread_user_id", ["id", "userId"])
        .index("by_thread_id", ["id"]),

    messages: defineTable({
        id: v.string(),
        threadId: v.string(),
        content: v.string(),
        role: roleValidator,
        reasoning: v.optional(v.string())
        // parts: v.array(v.union(
        //     v.object({
        //         type: v.literal('text'),
        //         text: v.string()
        //     }),
        //     v.object({
        //         type: v.literal('reasoning'),
        //         reasoning: v.string(),
        //         details: v.any()
        //     }),
        //     v.object({
        //         // not using any tools in this app
        //         type: v.literal('tool-invocation'),
        //         toolInvocation: v.any()
        //     }),
        //     v.object({
        //         type: v.literal('source'),
        //         source: v.object({
        //             sourceType: v.literal("url"),
        //             id: v.string(),
        //             url: v.string(),
        //             title: v.optional(v.string())
        //         })
        //     }),
        //     v.object({
        //         type: v.literal('file'),
        //         mimeType: v.string(),
        //         data: v.string()
        //     }),
        //     v.object({
        //         type: v.literal('step-start'),
        //     }),
        // ))
    }).index("by_thread_id", ["threadId"]).index("by_message_id", ["id"])
})

export default schema;