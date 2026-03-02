import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animateIcon?: boolean;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
  secondary: 'bg-navy text-white hover:bg-navy-light focus:ring-navy shadow-lg shadow-navy/25',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      animateIcon = true,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          group inline-flex items-center justify-center gap-2 rounded-lg font-semibold
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={animateIcon ? 'transition-transform duration-300 group-hover:translate-x-1' : ''}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
