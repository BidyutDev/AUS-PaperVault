import AdminPanel from '../components/AdminPanel/AdminPanel';
import { motion } from 'framer-motion';

export default function AdminPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'linear' }}
      style={{ minHeight: '100vh', willChange: 'opacity' }}
    >
      <AdminPanel />
    </motion.div>
  );
}
