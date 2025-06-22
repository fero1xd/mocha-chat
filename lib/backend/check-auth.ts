import "server-only";

import { auth } from "../auth";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { AuthError } from "./analytics/errors";
import * as Sentry from "@sentry/node";

export async function getJwtFromRequest() {
  try {
    const headers = await getHeaders();
    const session = await auth.api.getSession({
      headers,
    });
    const cookies = await getCookies();
    const jwt = cookies.get("jwt");

    if (!jwt || !session) {
      throw new AuthError();
    }

    return { jwt, session };
  } catch (e) {
    console.log("auth check failed");
    console.log(e);
    Sentry.captureException(e);
    throw new AuthError();
  }
}
