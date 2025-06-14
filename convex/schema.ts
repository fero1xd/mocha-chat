import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    threads: defineTable({
        id: v.string(),
        title: v.string(),
        userId: v.string(),
        lastMessageAt: v.number()
    }).
        index("by_userId", ["userId"]).
        index("by_id_userId", ["id", "userId"]).
        index("by_last_message", ["lastMessageAt"])
})

export default schema;