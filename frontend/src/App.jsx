import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FloatingActions from "./components/FloatingActions/FloatingActions";
import NotificationsPopup from "./components/NotificationsPopup/NotificationsPopup";

// Eager loaded for instant LCP
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import AdminPage from "./pages/AdminPage";

// Lazy loaded routes
const UploadPage = lazy(() => import("./pages/UploadPage"));
const DevsPage = lazy(() => import("./pages/DevsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const DeleteAccountPage = lazy(() => import("./pages/DeleteAccountPage"));

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
    else if (pathname === "/reset-password") title = "Reset Password — AUS PaperVault";
    else if (pathname === "/signup") title = "Sign Up — AUS PaperVault";
    else if (pathname === "/upload") title = "Upload — AUS PaperVault";
    else if (pathname === "/devs") title = "Developers — AUS PaperVault";
    else if (pathname === "/admin") title = "Admin — AUS PaperVault";
    else if (pathname === "/feedback") title = "Feedback — AUS PaperVault";
    else if (pathname === "/bookmarks") title = "Saved Papers — AUS PaperVault";
    else if (pathname === "/donate") title = "Donate — AUS PaperVault";

    document.title = title;
  }, [pathname]);
}

function AppLayout() {
  const location = useLocation();
  useDocumentTitle();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/reset-password";
  const isAdminPage = location.pathname.startsWith("/admin");

  const { user, isLoading } = useAuth();

  
    useEffect(() => {
      // Wait until auth has finished loading before evaluating user role.
      // Without this guard, user is null on first render for everyone,
      // which causes the DevTools hook to be destroyed, blanking the page.
      if (isLoading) return;

      if (!user || ["Member", "Moderator", "Reviewer"].includes(user.role)) {
        if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
          window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
        }
        const handleContextMenu = (e) => {
          e.preventDefault();
        };

        const handleKeyDown = (e) => {
          if (e.key === "F12") e.preventDefault();
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
      }
    }, [user, isLoading]);
  

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <FloatingActions />}
      <NotificationsPopup />
      <AnimatePresence initial={false}>
        {!isAdminPage && <Header key="header" />}
      </AnimatePresence>
      <main style={{ minHeight: (isAuthPage || isAdminPage) ? "100vh" : "calc(100vh - 160px)", position: "relative", zIndex: 10 }}>
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
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/delete-account" element={<DeleteAccountPage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <OverlayScrollbarsComponent
      element="div"
      options={{
        scrollbars: {
          theme: "os-theme-dark",
          autoHide: "scroll",
          autoHideDelay: 800,
          autoHideSuspend: false,
          visibility: "auto",
          clickScroll: true,
        },
        overflow: {
          x: "hidden",
          y: "scroll",
        },
      }}
      style={{ height: "100vh", width: "100%" }}
    >
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppLayout />
          </Router>
        </NotificationProvider>
      </AuthProvider>
      <Analytics />
    </OverlayScrollbarsComponent>
  );
}
