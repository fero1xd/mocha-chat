import posthog from 'posthog-js'
import * as Sentry from "@sentry/react";

console.log('register analytics');
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: 'history_change'
});


Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [
    ],

});