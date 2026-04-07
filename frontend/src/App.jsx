import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import DepartmentPage from './pages/DepartmentPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import DevsPage from './pages/DevsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: '60vh' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/department/:deptId" element={<DepartmentPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/devs" element={<DevsPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
