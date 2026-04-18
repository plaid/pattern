import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
  large?: boolean;
  secondary?: boolean;
  wide?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export function Button({
  small,
  large,
  secondary,
  wide,
  href,
  target,
  rel,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 cursor-pointer';
  const size = small
    ? 'px-3 py-1 text-sm'
    : large
      ? 'px-6 py-3 text-lg'
      : 'px-4 py-2 text-base';
  const variant = secondary
    ? 'border border-black-400 bg-white text-black-900 hover:bg-black-200'
    : 'bg-black-1000 text-white hover:bg-black-900';
  const width = wide ? 'w-full' : '';
  const disabledStyle = rest.disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [base, size, variant, width, disabledStyle, className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} aria-disabled={rest.disabled || undefined}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
