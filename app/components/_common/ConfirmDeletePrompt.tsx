"use client";

export function ConfirmDeletePrompt({ open, onConfirm, onCancel, characterName }: { open: boolean; onConfirm: () => void; onCancel: () => void; characterName: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg max-w-xs w-full">
        <div className="mb-4 text-lg font-bold text-center">Delete Character?</div>
        <div className="mb-4 text-center text-gray-700 dark:text-zinc-200">
          Are you sure you want to delete <span className="font-semibold">{characterName}</span>?
        </div>
        <div className="flex gap-4 justify-center">
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
} 