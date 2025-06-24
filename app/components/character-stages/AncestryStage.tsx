"use client";
import { useEffect, useState } from "react";
import { FormStage } from "@/app/components/character-stages/FormStage";
import { Modal } from "@/app/components/_common/Modal";

export const AncestryStage = ({ ancestry, setAncestry, onNext, onBack, progress, helpText }: any) => {
  const [ancestries, setAncestries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAncestry, setModalAncestry] = useState<any>(null);

  useEffect(() => {
    import("../../data/ancestries.json")
      .then((mod) => {
        setAncestries(mod.default || mod);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = ancestries.find(a => a.name === ancestry);

  if (loading) {
    return <FormStage title="Select Ancestry" progress={progress} helpText={helpText}><div>Loading ancestries...</div></FormStage>;
  }

  return (
    <FormStage
      title="Select Ancestry"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext} disabled={!ancestry}>Next</button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ancestries.map(a => (
          <div
            key={a.name}
            className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors
              ${ancestry === a.name ? "bg-blue-100 dark:bg-blue-900 border-blue-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
            onClick={() => { setModalAncestry(a); setModalOpen(true); }}
            tabIndex={0}
            aria-selected={ancestry === a.name}
          >
            <span className="font-semibold">{a.name}</span>
            <button
              className="ml-4 px-2 py-1 rounded border text-xs hover:bg-blue-50 dark:hover:bg-zinc-800"
              onClick={e => { e.stopPropagation(); setModalAncestry(a); setModalOpen(true); }}
              type="button"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {/* Modal for details */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalAncestry && (
          <div>
            <h3 className="text-lg font-bold mb-2">{modalAncestry.name}</h3>
            <div className="mb-2"><span className="font-semibold">Effect:</span> {modalAncestry.effect}</div>
            <div className="mb-4"><span className="font-semibold">Ability:</span> {modalAncestry.ability}</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => { setAncestry(modalAncestry.name); setModalOpen(false); }}
            >
              Select
            </button>
            <button
              className="px-4 py-2 rounded border"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>
      {selected && (
        <div className="mb-4 p-3 rounded bg-zinc-800 border border-zinc-700">
          <div className="mb-1"><span className="font-semibold">Effect:</span> {selected.effect}</div>
          <div className="mb-1"><span className="font-semibold">Ability:</span> {selected.ability}</div>
        </div>
      )}
    </FormStage>
  );
}; 