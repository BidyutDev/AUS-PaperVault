import AdminPanel from '../components/AdminPanel/AdminPanel';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

export default function AdminPage() {
  return (
    <motion.div 
      className="page-enter"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container-vault">
        <AdminPanel />
      </div>
    </motion.div>
  );
}
