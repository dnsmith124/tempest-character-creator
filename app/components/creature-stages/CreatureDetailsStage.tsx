"use client";
import { useState, useEffect } from "react";
import { DamageType, CreatureResistance } from "@/app/types/creature";
import damageTypes from "@/app/data/damage-types.json";

interface CreatureDetailsStageProps {
  quirk: string;
  resistances: CreatureResistance[];
  lootTable: {[key: number]: string};
  onQuirkChange: (quirk: string) => void;
  onResistancesChange: (resistances: CreatureResistance[]) => void;
  onLootTableChange: (lootTable: {[key: number]: string}) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CreatureDetailsStage = ({
  quirk,
  resistances,
  lootTable,
  onQuirkChange,
  onResistancesChange,
  onLootTableChange,
  onNext,
  onBack
}: CreatureDetailsStageProps) => {
  const [damageTypesList, setDamageTypesList] = useState<string[]>([]);
  const [showResistanceForm, setShowResistanceForm] = useState(false);
  const [newResistance, setNewResistance] = useState<CreatureResistance>({
    type: "Physical",
    value: "resistant"
  });

  useEffect(() => {
    setDamageTypesList(damageTypes.damage_types);
  }, []);

  const addResistance = () => {
    if (newResistance.type && newResistance.value) {
      onResistancesChange([...resistances, newResistance]);
      setNewResistance({ type: "Physical", value: "resistant" });
      setShowResistanceForm(false);
    }
  };

  const removeResistance = (index: number) => {
    onResistancesChange(resistances.filter((_, i) => i !== index));
  };

  const updateLootTable = (roll: number, loot: string) => {
    const updated = { ...lootTable };
    if (loot.trim()) {
      updated[roll] = loot;
    } else {
      delete updated[roll];
    }
    onLootTableChange(updated);
  };

  const getResistanceColor = (value: string) => {
    switch (value) {
      case 'resistant': return 'text-green-400';
      case 'weak': return 'text-red-400';
      case 'immune': return 'text-purple-400';
      default: return 'text-zinc-400';
    }
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
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Final Details</h2>
        <p className="text-zinc-300 mb-6">
          Add personality quirks, damage resistances, and loot table.
        </p>
      </div>

      {/* Quirk */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <label htmlFor="quirk" className="block text-sm font-medium text-zinc-300 mb-2">
          Quirk, Tactic, or Detail
        </label>
        <textarea
          id="quirk"
          value={quirk}
          onChange={(e) => onQuirkChange(e.target.value)}
          placeholder="e.g., Goblin Skewertossers hunt in packs and will often flee combat if they ever become outnumbered."
          rows={3}
          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Resistances */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-zinc-100">Damage Resistances</h3>
          <button
            onClick={() => setShowResistanceForm(!showResistanceForm)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            {showResistanceForm ? 'Cancel' : 'Add Resistance'}
          </button>
        </div>

        {showResistanceForm && (
          <div className="bg-zinc-700 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Damage Type
                </label>
                <select
                  value={newResistance.type}
                  onChange={(e) => setNewResistance({...newResistance, type: e.target.value as DamageType})}
                  className="w-full px-3 py-2 bg-zinc-600 border border-zinc-500 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {damageTypesList.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Resistance Type
                </label>
                <select
                  value={newResistance.value}
                  onChange={(e) => setNewResistance({...newResistance, value: e.target.value as 'resistant' | 'weak' | 'immune'})}
                  className="w-full px-3 py-2 bg-zinc-600 border border-zinc-500 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="resistant">Resistant (Half Damage)</option>
                  <option value="weak">Weak (Double Damage)</option>
                  <option value="immune">Immune (No Damage)</option>
                </select>
              </div>
            </div>
            <button
              onClick={addResistance}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Add Resistance
            </button>
          </div>
        )}

        {resistances.length > 0 ? (
          <div className="space-y-2">
            {resistances.map((resistance, index) => (
              <div key={index} className="flex items-center justify-between bg-zinc-700 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span>{getResistanceIcon(resistance.value)}</span>
                  <span className="text-zinc-100">{resistance.type}</span>
                  <span className={`text-sm ${getResistanceColor(resistance.value)}`}>
                    ({resistance.value})
                  </span>
                </div>
                <button
                  onClick={() => removeResistance(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-sm">No resistances added yet.</p>
        )}
      </div>

      {/* Loot Table */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-zinc-100 mb-3">Loot Table (d6)</h3>
        <p className="text-zinc-400 text-sm mb-3">
          Define what loot this creature drops when killed. Roll a d6 and consult this table.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((roll) => (
            <div key={roll} className="flex items-center gap-2">
              <span className="w-8 h-8 bg-zinc-700 rounded flex items-center justify-center text-sm font-medium text-zinc-100">
                {roll}
              </span>
              <input
                type="text"
                value={lootTable[roll] || ''}
                onChange={(e) => updateLootTable(roll, e.target.value)}
                placeholder={`Roll ${roll} loot...`}
                className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
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