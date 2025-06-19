"use client";
import { useEffect, useState } from "react";
import { FormStage } from "./FormStage";
import { Modal } from "../Modal";

type BackgroundStageProps = {
  background: string;
  setBackground: (b: string) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
  helpText: string;
};

export const BackgroundStage = ({ background, setBackground, onNext, onBack, progress, helpText }: BackgroundStageProps) => {
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBg, setModalBg] = useState<any>(null);

  useEffect(() => {
    import("../../data/backgrounds.json")
      .then((mod) => {
        setBackgrounds(mod.default || mod);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = backgrounds.find(bg => bg.name === background);

  if (loading) {
    return <FormStage title="Select Background" progress={progress} helpText={helpText}><div>Loading backgrounds...</div></FormStage>;
  }

  return (
    <FormStage
      title="Select Background"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext} disabled={!background}>Next</button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        {backgrounds.map(bg => (
          <div
            key={bg.name}
            className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors
              ${background === bg.name ? "bg-blue-100 dark:bg-blue-900 border-blue-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
            onClick={() => { setModalBg(bg); setModalOpen(true); }}
            tabIndex={0}
            aria-selected={background === bg.name}
          >
            <span className="font-semibold">{bg.name}</span>
            <button
              className="ml-4 px-2 py-1 rounded border text-xs hover:bg-blue-50 dark:hover:bg-zinc-800"
              onClick={e => { e.stopPropagation(); setModalBg(bg); setModalOpen(true); }}
              type="button"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {/* Modal for details */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalBg && (
          <div>
            <h3 className="text-lg font-bold mb-2">{modalBg.name}</h3>
            <div className="mb-2"><span className="font-semibold">Skill:</span> {modalBg.skill}</div>
            <div className="mb-2"><span className="font-semibold">Other Effect:</span> {modalBg.effect}</div>
            <div className="mb-4"><span className="font-semibold">Description:</span> {modalBg.description}</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => { setBackground(modalBg.name); setModalOpen(false); }}
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
          <div className="mb-1"><span className="font-semibold">Skill:</span> {selected.skill}</div>
          <div className="mb-1"><span className="font-semibold">Other Effect:</span> {selected.effect}</div>
          <div className="mb-1"><span className="font-semibold">Description:</span> {selected.description}</div>
        </div>
      )}
    </FormStage>
  );
}; 