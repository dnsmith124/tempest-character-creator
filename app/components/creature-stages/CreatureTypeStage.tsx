"use client";
import { CreatureType } from "../../types/creature";

interface CreatureTypeStageProps {
  creatureType: CreatureType | null;
  onTypeChange: (type: CreatureType) => void;
  onNext: () => void;
}

export const CreatureTypeStage = ({ creatureType, onTypeChange, onNext }: CreatureTypeStageProps) => {
  const creatureTypes = [
    {
      type: 'Minion' as CreatureType,
      description: 'Simplest form of creature. 1 HP, basic attack only, no saves, no loot.',
      characteristics: ['1 HP', 'Basic attack only', 'Saves automatically fail', 'No loot drops']
    },
    {
      type: 'Standard' as CreatureType,
      description: 'Standard creature with full stats and one ability.',
      characteristics: ['Full stats', '1 ability', 'Standard loot table', 'Normal saves']
    },
    {
      type: 'Elite' as CreatureType,
      description: 'More powerful than standard creatures, may lead groups.',
      characteristics: ['Enhanced stats', '1-2 abilities', 'Better loot', 'Leadership potential']
    },
    {
      type: 'Boss' as CreatureType,
      description: 'Most powerful creatures with multiple abilities and specific loot.',
      characteristics: ['Highest stats', '2-4 abilities', 'Specific loot drops', 'Solo combatant']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Choose Creature Type</h2>
        <p className="text-zinc-300 mb-6">
          Select the type of creature you want to create. This will determine the creature's power level and available options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creatureTypes.map(({ type, description, characteristics }) => (
          <div
            key={type}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-colors ${
              creatureType === type
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
            }`}
            onClick={() => onTypeChange(type)}
          >
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">{type}</h3>
            <p className="text-zinc-300 mb-4">{description}</p>
            <ul className="space-y-1">
              {characteristics.map((char, idx) => (
                <li key={idx} className="text-sm text-zinc-400 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {char}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!creatureType}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            creatureType
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