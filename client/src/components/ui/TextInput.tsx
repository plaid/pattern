import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextInput({ label, id, type = 'text', className = '', ...rest }: TextInputProps) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-black-800 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className="w-full border border-black-400 rounded px-3 py-2 text-base bg-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 placeholder:text-black-600 placeholder:opacity-70 transition-colors"
        {...rest}
      />
    </div>
  );
}
