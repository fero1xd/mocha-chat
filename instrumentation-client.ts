import posthog from 'posthog-js'
import * as Sentry from "@sentry/react";

console.log('register analytics', process.env.NODE_ENV);
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    autocapture: false,
    capture_pageview: false,
    loaded(posthog_instance) {
        if (process.env.ENVIRONMENT === 'development') {
            posthog_instance.opt_out_capturing(); // opts a user out of event capture
            posthog_instance.set_config({ disable_session_recording: true, capture_pageview: false, capture_pageleave: false });
        } else {
            posthog_instance.set_config({ capture_pageview: 'history_change' })
        }
    },
});


Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
    sendDefaultPii: true,
});