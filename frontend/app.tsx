import { BrowserRouter, Link, Route, Routes } from "react-router";
import { HomePage } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
