import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Link, Route, Routes } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
              <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
              </div>
            </div>
          }
        />
        <Route path="/page-two" element={<Link to="/">page two</Link>} />
      </Routes>
    </BrowserRouter>
  );
}
