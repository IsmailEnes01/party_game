import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ButtonProps } from "@/types";

const variantClasses = {
  primary: "bg-accent-600 text-white hover:bg-accent-500 active:bg-accent-700 shadow-[var(--shadow-glow)]",
  secondary: "bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 active:bg-slate-600",
  outline: "border-2 border-accent-500 text-accent-400 hover:bg-accent-500/10 active:bg-accent-500/20",
  ghost: "text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700",
} as const;

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
} as const;

type VariantKey = keyof typeof variantClasses;
type SizeKey = keyof typeof sizeClasses;

// Extract only the native button props we want to pass through, excluding Framer Motion drag handlers
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop"
>;

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading,
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const vKey = variant as VariantKey;
  const sKey = size as SizeKey;

  const nativeProps = props as NativeButtonProps;

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[vKey],
        sizeClasses[sKey],
        fullWidth && "w-full",
        className
      )}
      style={style}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      {...nativeProps}
    >
      {isLoading ? (
        <motion.svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <motion.circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <motion.circle
            className="opacity-75"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: "31.4 31.4",
              strokeDashoffset: "31.4",
            }}
            animate={{
              rotate: 360,
              strokeDashoffset: [0, 31.4],
            }}
            transition={{
              rotate: { duration: 1, ease: "linear", repeat: Infinity },
              strokeDashoffset: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
            }}
          />
        </motion.svg>
      ) : leftIcon ? (
        <span className="mr-2 flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};