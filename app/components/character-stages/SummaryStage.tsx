"use client";
import { FormStage } from "@/app/components/character-stages/FormStage";

type SummaryStageProps = {
  name: string;
  race: string;
  charClass: string;
  onBack: () => void;
  onSubmit: () => void;
  progress?: number;
  helpText?: string;
};

export const SummaryStage = ({ name, race, charClass, onBack, onSubmit, progress, helpText }: SummaryStageProps) => {
  return (
    <FormStage title="Summary" progress={progress} helpText={helpText}>
      <div><span className="font-semibold">Name:</span> {name}</div>
      <div><span className="font-semibold">Race:</span> {race}</div>
      <div><span className="font-semibold">Class:</span> {charClass}</div>
      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
      </div>
    </FormStage>
  );
}; 