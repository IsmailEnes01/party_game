import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import type { ButtonProps } from '@/types';

const variants: Record<string, string> = {
  primary: `
    bg-gradient-to-r from-accent-500 to-violet-600 text-white
    hover:from-accent-400 hover:to-violet-500
    shadow-lg shadow-accent-500/30 hover:shadow-accent-500/40
    focus-visible:ring-accent-500
    active:scale-[0.98]
  `,
  secondary: `
    bg-slate-800/50 text-white border border-slate-700
    hover:bg-slate-800 hover:border-slate-600
    focus-visible:ring-slate-500
    active:scale-[0.98]
  `,
  outline: `
    bg-transparent text-slate-100 border-2 border-slate-600
    hover:border-accent-500 hover:text-white hover:bg-accent-500/10
    focus-visible:ring-accent-500
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent text-slate-300
    hover:bg-slate-800/50 hover:text-white
    focus-visible:ring-slate-500
    active:scale-[0.98]
  `,
};

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      onClick,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-xl transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };