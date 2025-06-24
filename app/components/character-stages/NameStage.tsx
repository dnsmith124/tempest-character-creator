"use client";
import { FormStage } from "@/app/components/character-stages/FormStage";

type NameStageProps = {
  name: string;
  setName: (n: string) => void;
  onNext: () => void;
  progress?: number;
  helpText?: string;
};

export const NameStage = ({ name, setName, onNext, progress, helpText }: NameStageProps) => {
  return (
    <FormStage title="Character Name" progress={progress} helpText={helpText}>
      <label className="font-semibold" htmlFor="character-name">Character Name</label>
      <input
        id="character-name"
        className="border rounded px-3 py-2"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your character's name"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded self-end" onClick={onNext} disabled={!name}>
        Next
      </button>
    </FormStage>
  );
}; 