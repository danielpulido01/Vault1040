interface AccentTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AccentText({ children, className = '' }: AccentTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 text-primary">{children}</span>
      <span className="absolute -bottom-2 left-0 h-3 w-full -skew-x-3 bg-primary/20" />
    </span>
  );
}
