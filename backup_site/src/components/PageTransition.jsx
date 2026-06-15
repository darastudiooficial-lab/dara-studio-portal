import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  // Default soft fade and subtle slide up
  default: {
    initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -15, filter: 'blur(4px)', transition: { duration: 0.2 } },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  // Special portal entry for Login/Portal (creative 3D scale effect)
  portal: {
    initial: { opacity: 0, scale: 0.95, rotateX: 10, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.3 } },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  // Quick slide from left
  slide: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  // Fade variant – used for public pages
  fade: {
    initial: { opacity: 0, filter: 'blur(4px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)', transition: { duration: 0.2 } },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function PageTransition({ children, variant = 'default', className = '' }) {
  const selectedVariant = variants[variant] || variants.default;

  return (
    <motion.div
      className={`page-transition-wrapper ${className}`}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={selectedVariant.transition}
      style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  );
}
