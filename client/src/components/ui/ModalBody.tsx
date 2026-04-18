import React from 'react';
import { Button } from './Button.tsx';

interface ModalBodyProps {
  header: string;
  isLoading?: boolean;
  onClickCancel?: () => void;
  onClickConfirm?: () => void;
  confirmText?: string;
  children: React.ReactNode;
}

export function ModalBody({
  header,
  isLoading,
  onClickCancel,
  onClickConfirm,
  confirmText = 'Confirm',
  children,
}: ModalBodyProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{header}</h2>
      {isLoading ? (
        <div className="flex justify-center py-8" role="status" aria-label="Loading">
          <div className="animate-spin h-8 w-8 border-4 border-black-300 border-t-black-1000 rounded-full" />
        </div>
      ) : (
        <>
          <div className="mb-4">{children}</div>
          {(onClickCancel || onClickConfirm) && (
            <div className="flex justify-end gap-3">
              {onClickCancel && (
                <Button secondary onClick={onClickCancel}>
                  Cancel
                </Button>
              )}
              {onClickConfirm && (
                <Button onClick={onClickConfirm}>{confirmText}</Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
