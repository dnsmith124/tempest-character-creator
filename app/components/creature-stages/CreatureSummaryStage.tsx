"use client";
import { Creature } from "@/app/types/creature";

interface CreatureSummaryStageProps {
  creature: Creature;
  onSubmit: () => void;
  onBack: () => void;
}

export const CreatureSummaryStage = ({ creature, onSubmit, onBack }: CreatureSummaryStageProps) => {
  const getAttributeRating = (value: number): string => {
    if (value <= -1) return "Poor";
    if (value <= 2) return "Average";
    if (value <= 4) return "Above Average";
    if (value <= 6) return "Exemplary";
    return "Incredibly Powerful";
  };

  const getAttributeColor = (value: number): string => {
    if (value <= -1) return "text-red-400";
    if (value <= 2) return "text-yellow-400";
    if (value <= 4) return "text-green-400";
    if (value <= 6) return "text-blue-400";
    return "text-purple-400";
  };

  const getResistanceIcon = (value: string) => {
    switch (value) {
      case 'resistant': return '🛡️';
      case 'weak': return '💔';
      case 'immune': return '✨';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Creature Summary</h2>
        <p className="text-zinc-300 mb-6">
          Review your creature before creating it.
        </p>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        {/* Header */}
        <div className="border-b border-zinc-700 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-zinc-100">{creature.name}</h3>
              <p className="text-zinc-400">{creature.type} • {creature.role}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-zinc-100">HP {creature.hp}</div>
              <div className="text-sm text-zinc-400">
                Armor {creature.armor} • Barrier {creature.barrier} • MVMT {creature.mvmt}
              </div>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(['STR', 'AGL', 'MND', 'VIG'] as const).map((attr) => (
            <div key={attr} className="text-center">
              <div className="text-sm text-zinc-400">{attr}</div>
              <div className={`text-lg font-semibold ${getAttributeColor(creature.attributes[attr])}`}>
                {creature.attributes[attr] >= 0 ? '+' : ''}{creature.attributes[attr]}
              </div>
              <div className="text-xs text-zinc-500">{getAttributeRating(creature.attributes[attr])}</div>
            </div>
          ))}
        </div>

        {/* Weapon */}
        <div className="bg-zinc-700 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-zinc-100 mb-1">Weapon</h4>
          <p className="text-zinc-300">
            {creature.weapon.name} ({creature.weapon.damage}, Range {creature.weapon.range}, {creature.weapon.damageType})
          </p>
        </div>

        {/* Abilities */}
        {creature.abilities.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-zinc-100 mb-2">Abilities</h4>
            <div className="space-y-2">
              {creature.abilities.map((ability, index) => (
                <div key={index} className="bg-zinc-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-zinc-100">{ability.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      ability.type === 'action' ? 'bg-blue-600 text-white' :
                      ability.type === 'reaction' ? 'bg-green-600 text-white' :
                      'bg-purple-600 text-white'
                    }`}>
                      {ability.type}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{ability.description}</p>
                  {ability.uses && (
                    <p className="text-xs text-zinc-400 mt-1">Uses: {ability.uses}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quirk */}
        {creature.quirk && (
          <div className="mb-4">
            <h4 className="font-semibold text-zinc-100 mb-2">Quirk</h4>
            <p className="text-zinc-300 bg-zinc-700 rounded-lg p-3">{creature.quirk}</p>
          </div>
        )}

        {/* Resistances */}
        {creature.resistances && creature.resistances.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-zinc-100 mb-2">Resistances</h4>
            <div className="flex flex-wrap gap-2">
              {creature.resistances.map((resistance, index) => (
                <div key={index} className="flex items-center gap-1 bg-zinc-700 rounded-lg px-3 py-1">
                  <span>{getResistanceIcon(resistance.value)}</span>
                  <span className="text-zinc-100">{resistance.type}</span>
                  <span className="text-xs text-zinc-400">({resistance.value})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loot Table */}
        {creature.lootTable && Object.keys(creature.lootTable).length > 0 && (
          <div>
            <h4 className="font-semibold text-zinc-100 mb-2">Loot Table</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map((roll) => (
                creature.lootTable![roll] && (
                  <div key={roll} className="flex items-center gap-2 bg-zinc-700 rounded-lg p-2">
                    <span className="w-6 h-6 bg-zinc-600 rounded flex items-center justify-center text-xs font-medium text-zinc-100">
                      {roll}
                    </span>
                    <span className="text-sm text-zinc-300">{creature.lootTable![roll]}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Create Creature
        </button>
      </div>
    </div>
  );
}; 