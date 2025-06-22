import { Migrations } from "@convex-dev/migrations";
import { DataModel } from "./_generated/dataModel.js";
import { components, internal } from "./_generated/api.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const setMessageStatus = migrations.define({
  table: "messages",
  migrateOne: async (ctx, doc) => {
    if (doc.status === undefined) {
      await ctx.db.patch(doc._id, {
        status: "done",
      });
    }
  },
});

export const migrateStatus = migrations.runner(
  internal.migrations.setMessageStatus
);
