"use client";
import { useEffect, useState } from "react";
import { FormStage } from "@/app/components/character-stages/FormStage";
import { Modal } from "@/app/components/_common/Modal";

export const KitStage = ({ kit, setKit, onNext, onBack, progress, helpText }: any) => {
  const [kits, setKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKit, setModalKit] = useState<any>(null);

  useEffect(() => {
    import("../../data/kits.json")
      .then((mod) => {
        setKits(mod.default || mod);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = kits.find(k => k.name === kit);

  if (loading) {
    return <FormStage title="Select Kit" progress={progress} helpText={helpText}><div>Loading kits...</div></FormStage>;
  }

  return (
    <FormStage
      title="Select Kit"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext} disabled={!kit}>Next</button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        {kits.map(k => (
          <div
            key={k.name}
            className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors
              ${kit === k.name ? "bg-blue-100 dark:bg-blue-900 border-blue-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
            onClick={() => { setModalKit(k); setModalOpen(true); }}
            tabIndex={0}
            aria-selected={kit === k.name}
          >
            <span className="font-semibold">{k.name}</span>
            <button
              className="ml-4 px-2 py-1 rounded border text-xs hover:bg-blue-50 dark:hover:bg-zinc-800"
              onClick={e => { e.stopPropagation(); setModalKit(k); setModalOpen(true); }}
              type="button"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {/* Modal for details */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalKit && (
          <div>
            <h3 className="text-lg font-bold mb-2">{modalKit.name}</h3>
            <div className="mb-2"><span className="font-semibold">Items:</span></div>
            <ul className="list-disc ml-6 mb-4">
              {modalKit.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => { setKit(modalKit.name); setModalOpen(false); }}
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
          <div className="mb-1"><span className="font-semibold">Items:</span></div>
          <ul className="list-disc ml-6">
            {selected.items.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </FormStage>
  );
}; 