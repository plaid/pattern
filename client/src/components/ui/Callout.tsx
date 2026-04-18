import React from 'react';

interface CalloutProps {
  warning?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Callout({ warning, className = '', style, children }: CalloutProps) {
  const base = 'rounded border p-4 text-sm';
  const variant = warning
    ? 'bg-yellow-200 border-yellow-600 text-black-900'
    : 'bg-blue-200 border-blue-600 text-black-900';

  return (
    <div className={`${base} ${variant} ${className}`} style={style}>
      {children}
    </div>
  );
}
