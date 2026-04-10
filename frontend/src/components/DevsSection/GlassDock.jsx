import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import './GlassDock.css';

export const GlassDock = React.forwardRef(
  ({ items, className, dockClassName, ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [direction, setDirection] = useState(0);

    const handleMouseEnter = (index) => {
      if (hoveredIndex !== null && index !== hoveredIndex) {
        setDirection(index > hoveredIndex ? 1 : -1);
      }
      setHoveredIndex(index);
    };

    const getTooltipPosition = (index) => index * 52 + 12;

    return (
      <div ref={ref} className={cn('w-max', className)} {...props}>
        <div
          className={cn(
            "relative flex gap-4 items-center px-6 py-4 rounded-2xl",
            "backdrop-blur-xl shadow-2xl glass-dock-container",
            dockClassName
          )}
          style={{ height: "64px" }}
          onMouseLeave={() => {
            setHoveredIndex(null);
            setDirection(0);
          }}
        >
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.92, y: 35 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 70,
                  x: getTooltipPosition(hoveredIndex),
                }}
                exit={{ opacity: 0, scale: 0.92, y: 35 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="absolute top-0 left-0 pointer-events-none z-30"
              >
                <div
                  className={cn(
                    'px-5 py-2 rounded-lg',
                    'shadow-md flex items-center justify-center glass-dock-tooltip',
                    'min-w-25 '
                  )}
                >
                  <div className="relative h-4 flex items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <motion.span
                        key={items[hoveredIndex].title}
                        custom={direction}
                        initial={{
                          x: direction > 0 ? 35 : -35,
                          opacity: 0,
                          filter: 'blur(6px)',
                        }}
                        animate={{
                          x: 0,
                          opacity: 1,
                          filter: 'blur(0px)',
                        }}
                        exit={{
                          x: direction > 0 ? -35 : 35,
                          opacity: 0,
                          filter: 'blur(6px)',
                        }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                        }}
                        className="text-[13px] font-medium tracking-wide whitespace-nowrap"
                      >
                        {items[hoveredIndex].title}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {items.map((el, index) => {
            const Icon = el.icon;
            const isHovered = hoveredIndex === index;
            const handleClick = () => {
              if (el.onClick) {
                el.onClick();
              } else if (el.href) {
                window.open(el.href, '_blank', 'noopener,noreferrer');
              }
            };

            return (
              <div
                key={el.title}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={handleClick}
                className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                  }
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    y: isHovered ? -3 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Icon
                    size={22}
                    strokeWidth={2}
                    className={cn(
                      'transition-colors duration-200',
                      isHovered
                        ? 'text-[#afb3f7]'
                        : 'text-[#607b96]'
                    )}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

GlassDock.displayName = 'GlassDock';
export default GlassDock;
