import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roleValidator = v.union(
  v.literal("user"),
  v.literal("assistant"),
  v.literal("data"),
  v.literal("system")
);

export const statusValidator = v.union(
  v.literal("waiting"),
  v.literal("streaming"),
  v.literal("done"),
  v.literal("error")
);

const schema = defineSchema({
  threads: defineTable({
    id: v.string(),
    title: v.string(),
    userId: v.string(),
    lastMessageAt: v.number(),
    isStreaming: v.boolean(),
    pinned: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_thread_user_id", ["id", "userId"])
    .index("by_thread_id", ["id"]),

  messages: defineTable({
    id: v.string(),
    threadId: v.string(),
    model: v.optional(v.string()),
    role: roleValidator,

    content: v.string(),
    reasoning: v.optional(v.string()),
    status: v.optional(statusValidator),
  })
    .index("by_thread_id", ["threadId"])
    .index("by_message_id", ["id"]),
});

export default schema;
