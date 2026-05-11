"use client";
import { ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
}: IProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative mt-200 z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
