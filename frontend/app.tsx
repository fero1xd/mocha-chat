import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./routes";
import { Providers } from "@/components/providers";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
