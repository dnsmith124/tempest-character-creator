"use client";
import { useState } from "react";
import { FormStage } from "./FormStage";
import { Modal } from "../Modal";
import { RandomNameGenerator } from "../RandomNameGenerator";
import traitsData from "../../data/traits.json";

type TraitsStageProps = {
  traits: string[];
  setTraits: (t: string[]) => void;
  name: string;
  setName: (n: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  progress: number;
  helpText: string;
  ancestry: string;
};

export const TraitsStage = ({ traits, setTraits, name, setName, onBack, onSubmit, progress, helpText, ancestry }: TraitsStageProps) => {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [gender, setGender] = useState<"male" | "female">(Math.random() < 0.5 ? "male" : "female");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrait, setModalTrait] = useState<any>(null);

  const handleGenerate = (newName: string) => {
    // If we're not at the end of the history, slice off the future
    const newHistory = currentIdx < generatedNames.length - 1 ? generatedNames.slice(0, currentIdx + 1) : generatedNames;
    setGeneratedNames([...newHistory, newName]);
    setCurrentIdx(newHistory.length);
    setName(newName);
    setGender(Math.random() < 0.5 ? "male" : "female");
  };

  const goBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setName(generatedNames[currentIdx - 1]);
    }
  };

  const goForward = () => {
    if (currentIdx < generatedNames.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setName(generatedNames[currentIdx + 1]);
    }
  };

  const isSelected = (traitName: string) => traits.includes(traitName);
  const canSelect = (traitName: string, type: 'positive' | 'negative') => {
    if (isSelected(traitName)) return true;
    if (type === 'positive') {
      return !traits.some(t => traitsData.positive.some(pt => pt.name === t));
    } else {
      return !traits.some(t => traitsData.negative.some(nt => nt.name === t));
    }
  };
  const handleSelect = (traitName: string, type: 'positive' | 'negative') => {
    let newTraits = traits.filter(t => {
      if (type === 'positive') return !traitsData.positive.some(pt => pt.name === t);
      else return !traitsData.negative.some(nt => nt.name === t);
    });
    newTraits.push(traitName);
    setTraits(newTraits);
    setModalOpen(false);
  };

  return (
    <FormStage
      title="Traits & Name"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onSubmit} disabled={traits.length !== 2 || !name}>Submit</button>
        </>
      }
    >
      <div className="mb-4 flex flex-col gap-2">
        <label className="font-semibold mr-2" htmlFor="character-name">Character Name:</label>
        <input
          id="character-name"
          className="border rounded px-3 py-2"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your character's name"
        />
        <div className="flex items-center gap-2 mt-2">
          <RandomNameGenerator ancestry={ancestry} gender={gender} onGenerate={handleGenerate} buttonOnly={true} />
          <button
            className="px-2 py-1 rounded border bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goBack}
            disabled={currentIdx <= 0}
            type="button"
          >
            ◀
          </button>
          <button
            className="px-2 py-1 rounded border bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goForward}
            disabled={currentIdx === -1 || currentIdx >= generatedNames.length - 1}
            type="button"
          >
            ▶
          </button>
        </div>
      </div>
      <div className="mb-2">
        <div className="font-semibold mb-1">Positive Traits</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {traitsData.positive.map(trait => (
            <div
              key={trait.name}
              className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors
                ${isSelected(trait.name) ? "bg-green-100 dark:bg-green-900 border-green-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
              onClick={() => { setModalTrait({ ...trait, type: 'positive' }); setModalOpen(true); }}
              tabIndex={0}
              aria-selected={isSelected(trait.name)}
            >
              <span className="font-semibold">{trait.name}</span>
            </div>
          ))}
        </div>
        <div className="font-semibold mb-1">Negative Traits</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {traitsData.negative.map(trait => (
            <div
              key={trait.name}
              className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors
                ${isSelected(trait.name) ? "bg-red-100 dark:bg-red-900 border-red-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
              onClick={() => { setModalTrait({ ...trait, type: 'negative' }); setModalOpen(true); }}
              tabIndex={0}
              aria-selected={isSelected(trait.name)}
            >
              <span className="font-semibold">{trait.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for trait details */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalTrait && (
          <div>
            <h3 className="text-lg font-bold mb-2">{modalTrait.name}</h3>
            <div className="mb-4 text-gray-700 dark:text-zinc-200">{modalTrait.description}</div>
            <button
              className={`px-4 py-2 rounded mr-2 text-white ${modalTrait.type === 'positive' ? 'bg-green-600' : 'bg-red-600'} disabled:opacity-50`}
              onClick={() => handleSelect(modalTrait.name, modalTrait.type)}
              disabled={!canSelect(modalTrait.name, modalTrait.type)}
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
    </FormStage>
  );
}; 