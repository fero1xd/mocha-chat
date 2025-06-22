import { betterFetch } from "@better-fetch/fetch";

export async function getVersion() {
  const res = await betterFetch<{ deploymentId: string }>("/api/v");
  if (!res.data) return;

  return res.data.deploymentId;
}
