"use client";
import { FormStage } from "./stages/FormStage";

type ClassStageProps = {
  charClass: string;
  setCharClass: (c: string) => void;
  onNext: () => void;
  onBack: () => void;
  progress?: number;
  helpText?: string;
};

export const ClassStage = ({ charClass, setCharClass, onNext, onBack, progress, helpText }: ClassStageProps) => {
  const classes = ["Fighter", "Wizard", "Rogue", "Cleric"];
  return (
    <FormStage title="Class" progress={progress} helpText={helpText}>
      <label className="font-semibold" htmlFor="class-select">Class</label>
      <select id="class-select" className="border rounded px-3 py-2" value={charClass} onChange={e => setCharClass(e.target.value)}>
        <option value="">Select a class</option>
        {classes.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onNext} disabled={!charClass}>
          Next
        </button>
      </div>
    </FormStage>
  );
}; 