import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@sentry/react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ChatLayout } from "./layouts/chat";
import { HomePage } from "./routes";
import { ChatPage } from "./routes/chat";
import { RootLayout } from "./layouts";

export default function App() {
  return (
    <ErrorBoundary fallback={<p>An error occurred</p>}>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<ChatLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/:threadId" element={<ChatPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}
