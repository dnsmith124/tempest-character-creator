"use client";
import { ReactNode, useEffect } from "react";

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
      <div className="bg-white dark:bg-zinc-900 rounded shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
} 