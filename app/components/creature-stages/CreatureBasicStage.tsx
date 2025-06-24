"use client";
import { CreatureType } from "@/app/types/creature";

interface CreatureBasicStageProps {
  name: string;
  onNameChange: (name: string) => void;
  creatureType: CreatureType;
  onNext: () => void;
  onBack: () => void;
}

export const CreatureBasicStage = ({ 
  name, 
  onNameChange, 
  creatureType, 
  onNext, 
  onBack 
}: CreatureBasicStageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Basic Information</h2>
        <p className="text-zinc-300 mb-6">
          Give your {creatureType.toLowerCase()} a name and basic description.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="creature-name" className="block text-sm font-medium text-zinc-300 mb-2">
            Creature Name
          </label>
          <input
            type="text"
            id="creature-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Goblin Skewertosser, Ancient Dragon, etc."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Creature Type: {creatureType}</h3>
          <p className="text-zinc-300 text-sm">
            {creatureType === 'Minion' && 'Minions are the simplest creatures with 1 HP and basic attacks only.'}
            {creatureType === 'Standard' && 'Standard creatures have full stats and one ability.'}
            {creatureType === 'Elite' && 'Elite creatures are more powerful and may lead groups.'}
            {creatureType === 'Boss' && 'Boss creatures are the most powerful with multiple abilities.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!name.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            name.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}; 