import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// 1. Standard Fade & Slide Up Reveal
export const ScrollReveal: React.FC<Props> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 2. Slow Fade In (for quotes and text)
export const SlowFadeIn: React.FC<Props> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. Image Scale Reveal (Cinematic zoom out)
export const ScaleImageReveal: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 4. Staggered Container & Item (for Grids)
export const StaggerContainer: React.FC<Props> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: delay,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
