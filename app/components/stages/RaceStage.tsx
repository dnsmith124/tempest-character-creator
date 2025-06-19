"use client";
import { FormStage } from "./FormStage";

type RaceStageProps = {
  race: string;
  setRace: (r: string) => void;
  onNext: () => void;
  onBack: () => void;
  progress?: number;
  helpText?: string;
};

export const RaceStage = ({ race, setRace, onNext, onBack, progress, helpText }: RaceStageProps) => {
  const races = ["Human", "Elf", "Dwarf", "Orc"];
  return (
    <FormStage title="Race" progress={progress} helpText={helpText}>
      <label className="font-semibold" htmlFor="race-select">Race</label>
      <select id="race-select" className="border rounded px-3 py-2" value={race} onChange={e => setRace(e.target.value)}>
        <option value="">Select a race</option>
        {races.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onNext} disabled={!race}>
          Next
        </button>
      </div>
    </FormStage>
  );
}; 