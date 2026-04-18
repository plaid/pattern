import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center" role="status" aria-label="Loading">
      <div className="animate-spin h-10 w-10 border-4 border-black-300 border-t-black-1000 rounded-full" />
    </div>
  );
}
