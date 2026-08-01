import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/common/LoadingScreen";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Lazy-loaded page components for optimal performance and chunk splitting
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Portal = lazy(() => import("./pages/Portal"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Verify = lazy(() => import("./pages/Verify"));
const HardwareProblems = lazy(() => import("./pages/HardwareProblems"));
const Success = lazy(() => import("./pages/Success"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/hardware-problems" element={<HardwareProblems />} />
            <Route path="/problem-statements" element={<HardwareProblems />} />
            <Route path="/success" element={<Success />} />

            {/* Admin Protected Console */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;