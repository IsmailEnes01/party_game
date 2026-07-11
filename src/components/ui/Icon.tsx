import { forwardRef, type SVGProps } from 'react';
import { cn } from '@/utils/cn';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      strokeWidth = 2,
      className,
      'aria-label': ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };