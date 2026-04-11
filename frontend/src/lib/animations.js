// Shared page-transition animation config
// Extracted from individual page files to avoid duplication

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export const pageTransition = {
  duration: 0.25,
  ease: 'easeOut',
};
