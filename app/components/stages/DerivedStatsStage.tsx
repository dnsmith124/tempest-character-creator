"use client";
import { FormStage } from "./FormStage";

type DerivedStatsStageProps = {
  derivedStats: {
    HP: number;
    RecoveryDice: number;
    MVMT: number;
    Initiative: number;
    Inventory: number;
    Memory: number;
    Languages: number;
  };
  onNext: () => void;
  onBack: () => void;
  progress: number;
  helpText: string;
};

export const DerivedStatsStage = ({ derivedStats, onNext, onBack, progress, helpText }: DerivedStatsStageProps) => {
  return (
    <FormStage
      title="Derived Stats"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext}>Next</button>
        </>
      }
    >
      <ul className="mb-4 space-y-1">
        <li><b>HP:</b> {derivedStats.HP}</li>
        <li><b>Recovery Dice:</b> {derivedStats.RecoveryDice}d4</li>
        <li><b>MVMT:</b> {derivedStats.MVMT}</li>
        <li><b>Initiative:</b> {derivedStats.Initiative}</li>
        <li><b>Inventory Slots:</b> {derivedStats.Inventory}</li>
        <li><b>Memory:</b> {derivedStats.Memory}</li>
        <li><b>Languages:</b> {derivedStats.Languages}</li>
      </ul>
    </FormStage>
  );
}; 