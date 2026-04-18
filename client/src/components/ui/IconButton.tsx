import React from 'react';

interface IconButtonProps {
  accessibilityLabel: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function IconButton({ accessibilityLabel, icon, onClick, className = '' }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={accessibilityLabel}
      onClick={onClick}
      className={`inline-flex items-center justify-center p-1 rounded hover:bg-black-200 transition-colors cursor-pointer ${className}`}
    >
      {icon}
    </button>
  );
}
