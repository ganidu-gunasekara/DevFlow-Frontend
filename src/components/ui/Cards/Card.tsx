interface CardProps {
  title: string;
  linkText?: string;
  onLinkClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, linkText, children, className }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-3 ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-text">{title}</span>
        {linkText && <span className="text-xs text-brand cursor-pointer">{linkText} →</span>}
      </div>
      {children}
    </div>
  );
}