import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Eager loaded for instant LCP
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";

// Lazy loaded routes
const UploadPage = lazy(() => import("./pages/UploadPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const DevsPage = lazy(() => import("./pages/DevsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));

function PageSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "4rem",
        color: "var(--color-vault-steel)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
      }}
    >
      Loading module...
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function useDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    let title = "AUS PaperVault";
    if (pathname.startsWith("/department/")) {
      const dept = pathname.split("/")[2];
      title = `${dept.toUpperCase()} — AUS PaperVault`;
    } else if (pathname === "/login") title = "Login — AUS PaperVault";
    else if (pathname === "/signup") title = "Sign Up — AUS PaperVault";
    else if (pathname === "/upload") title = "Upload — AUS PaperVault";
    else if (pathname === "/devs") title = "Developers — AUS PaperVault";
    else if (pathname === "/admin") title = "Admin — AUS PaperVault";
    else if (pathname === "/feedback") title = "Feedback — AUS PaperVault";
    else if (pathname === "/bookmarks") title = "Saved Papers — AUS PaperVault";

    document.title = title;
  }, [pathname]);
}

function AppLayout() {
  const location = useLocation();
  useDocumentTitle();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: isAuthPage ? "100vh" : "calc(100vh - 160px)" }}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/department/:deptId" element={<DepartmentPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/devs" element={<DevsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
  }
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I / J / C
      if (
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
