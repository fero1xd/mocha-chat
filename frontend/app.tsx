import { Providers } from "@/components/providers";
import { BrowserRouter, Route, Routes } from "react-router";
import { ChatLayout } from "./layouts/chat";
import { HomePage } from "./routes";
import { ChatPage } from "./routes/chat";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/:threadId" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
