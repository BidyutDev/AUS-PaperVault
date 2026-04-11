import { motion } from "framer-motion";
import { Bookmark, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PaperList from "../components/PaperList/PaperList";
import { useBookmarks } from "../hooks/useBookmarks";
import { useAllPapers } from "../hooks/useDepartments";
import { pageTransition, pageVariants } from "../lib/animations";
import "./BookmarksPage.css";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const allPapers = useAllPapers();
  const bookmarkedPapers = allPapers.filter((p) => bookmarks.includes(String(p.id)));

  return (
    <motion.div
      className="bookmarks-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="container-vault">
        <header className="page-header">
          <h1 className="page-title">
            Saved <span style={{ color: "var(--color-vault-lavender)" }}>Papers</span>
          </h1>
          <p className="page-subtitle">Your personal collection of quick-access question papers</p>
        </header>

        {bookmarkedPapers.length === 0 ? (
          <div className="bookmarks-empty">
            <Bookmark size={48} className="empty-icon" />
            <h2>No saved papers yet</h2>
            <p>Papers you save using the bookmark icon will appear here for easy access.</p>
            <Link to="/" className="btn-cyber-solid">
              <Search size={18} />
              Browse Departments
            </Link>
          </div>
        ) : (
          <PaperList papers={bookmarkedPapers} />
        )}
      </div>
    </motion.div>
  );
}
