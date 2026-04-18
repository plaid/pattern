import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onRequestClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onRequestClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === overlayRef.current) onRequestClose();
      }}
    >
      <div role="dialog" aria-modal="true" className="bg-white rounded shadow-md max-w-[500px] w-[90%] max-h-[90vh] overflow-auto relative z-[1001]">
        {children}
      </div>
    </div>,
    document.body
  );
}
