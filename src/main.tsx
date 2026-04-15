import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "@/lib/sentry";
import * as Sentry from "@sentry/react";

initSentry();

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center bg-background text-gray-900">Algo deu errado. Recarregue a página.</div>}>
    <App />
  </Sentry.ErrorBoundary>
);
