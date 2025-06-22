import "server-only";

import { ratelimit } from "@/lib/backend/redis";
import { RatelimitError } from "../analytics/errors";

export async function rateLimitGeneration(id: string) {
  if (process.env.NODE_ENV !== "production") return;
  const { success } = await ratelimit.limit(id);
  if (!success) {
    throw new RatelimitError();
  }
}
