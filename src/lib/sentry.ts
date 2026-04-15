import * as Sentry from "@sentry/react";

// Initialize Sentry for error tracking and performance monitoring
// Note: Uses modern Sentry v10+ API (browserTracingIntegration instead of BrowserTracing class)
// The old @sentry/tracing package (v7) has been removed due to version conflicts
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
  });
};

export default Sentry;
