"use client";
import { useState, useEffect } from "react";
import { CreatureType, CreatureAbility } from "@/app/types/creature";
import creatureAbilities from "@/app/data/creature-abilities.json";

interface CreatureAbilitiesStageProps {
  abilities: CreatureAbility[];
  creatureType: CreatureType;
  onAbilitiesChange: (abilities: CreatureAbility[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CreatureAbilitiesStage = ({
  abilities,
  creatureType,
  onAbilitiesChange,
  onNext,
  onBack
}: CreatureAbilitiesStageProps) => {
  const [availableAbilities, setAvailableAbilities] = useState<any[]>([]);
  const [selectedAbilities, setSelectedAbilities] = useState<CreatureAbility[]>(abilities);

  useEffect(() => {
    setAvailableAbilities(creatureAbilities.abilities);
  }, []);

  useEffect(() => {
    onAbilitiesChange(selectedAbilities);
  }, [selectedAbilities, onAbilitiesChange]);

  const getMaxAbilities = (type: CreatureType): number => {
    switch (type) {
      case 'Minion': return 0; // Minions have no abilities
      case 'Standard': return 1;
      case 'Elite': return 2;
      case 'Boss': return 4;
      default: return 1;
    }
  };

  const handleAbilityToggle = (ability: any) => {
    const isSelected = selectedAbilities.some(a => a.name === ability.name);
    
    if (isSelected) {
      setSelectedAbilities(selectedAbilities.filter(a => a.name !== ability.name));
    } else {
      if (selectedAbilities.length < getMaxAbilities(creatureType)) {
        setSelectedAbilities([...selectedAbilities, {
          name: ability.name,
          description: ability.description,
          type: ability.type,
          uses: ability.uses
        }]);
      }
    }
  };

  const removeAbility = (abilityName: string) => {
    setSelectedAbilities(selectedAbilities.filter(a => a.name !== abilityName));
  };

  const maxAbilities = getMaxAbilities(creatureType);

  if (creatureType === 'Minion') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Abilities</h2>
          <p className="text-zinc-300 mb-6">
            Minions have no special abilities - they only have basic attacks.
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Basic Attack Only</h3>
            <p className="text-zinc-400">
              Minions rely solely on their basic weapon attacks. No special abilities needed.
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
            className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Abilities</h2>
        <p className="text-zinc-300 mb-6">
          Select up to {maxAbilities} ability{maxAbilities !== 1 ? 'ies' : ''} for your {creatureType.toLowerCase()}.
        </p>
      </div>

      {/* Selected Abilities */}
      {selectedAbilities.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-zinc-100 mb-3">
            Selected Abilities ({selectedAbilities.length}/{maxAbilities})
          </h3>
          <div className="space-y-3">
            {selectedAbilities.map((ability) => (
              <div key={ability.name} className="bg-zinc-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-zinc-100">{ability.name}</h4>
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
                  <button
                    onClick={() => removeAbility(ability.name)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Abilities */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-zinc-100 mb-3">Available Abilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {availableAbilities.map((ability) => {
            const isSelected = selectedAbilities.some(a => a.name === ability.name);
            const isDisabled = !isSelected && selectedAbilities.length >= maxAbilities;
            
            return (
              <div
                key={ability.name}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : isDisabled
                    ? 'border-zinc-600 bg-zinc-700/50 cursor-not-allowed'
                    : 'border-zinc-600 bg-zinc-700 hover:border-zinc-500'
                }`}
                onClick={() => !isDisabled && handleAbilityToggle(ability)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-zinc-100">{ability.name}</h4>
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
                {ability.role_suggestions && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Suggested roles: {ability.role_suggestions.join(', ')}
                  </p>
                )}
              </div>
            );
          })}
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
          className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 