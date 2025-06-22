import "server-only";

import * as Sentry from "@sentry/node";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
});
