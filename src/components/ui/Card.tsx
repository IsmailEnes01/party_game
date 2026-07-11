import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import type { CardProps } from '@/types';

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      hover = true,
      padding = 'md',
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-xl',
          'overflow-hidden transition-all duration-300',
          hover && 'hover:bg-slate-800/80 hover:border-slate-700 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(168,85,247,0.3),_0_0_30px_rgba(168,85,247,0.1)]',
          paddings[padding],
          className
        )}
        whileHover={hover ? { y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } } : undefined}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent opacity-0"
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 300 }}
          aria-hidden="true"
        />
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export { Card };