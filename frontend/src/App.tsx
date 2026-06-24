import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppDashboard from "./pages/AppDashboard";

import HowItWorksPage from "./pages/HowItWorksPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/app" element={<AppDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
