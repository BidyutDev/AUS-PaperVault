import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PerspectiveGrid from "../PerspectiveGrid/PerspectiveGrid";
import "./AuthLayout.css";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function AuthLayout({ children }) {
  // Interactive parallax background hooks
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const animateX1 = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1500], [60, -60]);
  const animateY1 = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [60, -60]);

  const animateX2 = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1500], [-80, 80]);
  const animateY2 = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-80, 80]);

  const animateX3 = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1500], [40, -40]);
  const animateY3 = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-40, 40]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    // Use requestAnimationFrame for smoother performance and to prevent layout thrashing
    window.requestAnimationFrame(() => {
      currentTarget.style.setProperty("--mouse-x", `${x}px`);
      currentTarget.style.setProperty("--mouse-y", `${y}px`);
    });
    
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      className="auth-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseMove={handleMouseMove}
    >
      <PerspectiveGrid />
      
      {/* GPU-Accelerated Cursor Glow Div */}
      <div className="auth-glow-cursor" />
      
      {/* Container wrapper for whatever Auth card is passed in */}
      {children}

      {/* Side Decoration (Interactive Parallax) */}
      <div className="auth-decoration">
        <motion.div className="parallax-wrap" style={{ x: animateX1, y: animateY1 }}>
          <div className="decoration-circle decoration-1"></div>
        </motion.div>
        <motion.div className="parallax-wrap" style={{ x: animateX2, y: animateY2 }}>
          <div className="decoration-circle decoration-2"></div>
        </motion.div>
        <motion.div className="parallax-wrap" style={{ x: animateX3, y: animateY3 }}>
          <div className="decoration-circle decoration-3"></div>
        </motion.div>
      </div>
    </motion.div>
  );
}
