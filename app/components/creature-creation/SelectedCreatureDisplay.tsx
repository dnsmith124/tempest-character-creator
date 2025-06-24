import React from 'react';
import { Creature } from '@/app/types/creature';

const boxClass = "bg-zinc-800 border border-zinc-700 rounded p-4 shadow";

const SelectedCreatureDisplay = ({
  creature,
  notes,
  handleNotesChange,
  showSaved
}: {
  creature: Creature,
  notes: string,
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  showSaved: boolean
}) => {
  const attrs = creature.attributes;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-zinc-100">{creature.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className={boxClass}>
          <span className="font-semibold">Basic Info:</span>
          <div className="ml-2 mt-1 grid grid-cols-2 gap-1 text-sm text-gray-300">
            <div>Type: {creature.type}</div>
            <div>Role: {creature.role}</div>
            <div>HP: {creature.hp}</div>
            <div>Armor: {creature.armor}</div>
            {creature.barrier > 0 && <div>Barrier: {creature.barrier}</div>}
            <div>Movement: {creature.mvmt}</div>
          </div>
        </div>

        {/* Attributes */}
        <div className={boxClass}>
          <span className="font-semibold">Attributes:</span>
          <div className="ml-2 mt-1 grid grid-cols-2 gap-1 text-sm text-gray-300">
            <div>STR: {attrs.STR}</div>
            <div>AGL: {attrs.AGL}</div>
            <div>MND: {attrs.MND}</div>
            <div>VIG: {attrs.VIG}</div>
          </div>
        </div>

        {/* Weapon */}
        <div className={boxClass}>
          <span className="font-semibold">Weapon:</span>
          <div className="ml-2 mt-1 text-sm text-gray-300">
            <div><span className="font-semibold">Name:</span> {creature.weapon.name}</div>
            <div><span className="font-semibold">Damage:</span> {creature.weapon.damage}</div>
            <div><span className="font-semibold">Range:</span> {creature.weapon.range}</div>
            <div><span className="font-semibold">Type:</span> {creature.weapon.damageType}</div>
          </div>
        </div>

        {/* Abilities */}
        <div className={boxClass}>
          <span className="font-semibold">Abilities:</span>
          <div className="mt-1 text-sm text-gray-300">
            {creature.abilities.length > 0 ? (
              <ul className="space-y-2">
                {creature.abilities.map((ability, idx) => (
                  <li key={idx} className="border-l-2 border-zinc-600 pl-2">
                    <div className="font-semibold">{ability.name}</div>
                    <div className="text-xs text-gray-400">{ability.type}</div>
                    {ability.uses && <div className="text-xs text-gray-400">Uses: {ability.uses}</div>}
                    <div className="text-xs">{ability.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No abilities</div>
            )}
          </div>
        </div>

        {/* Quirk */}
        {creature.quirk && (
          <div className={boxClass}>
            <span className="font-semibold">Quirk:</span>
            <div className="ml-2 mt-1 text-sm text-gray-300">{creature.quirk}</div>
          </div>
        )}

        {/* Resistances */}
        {creature.resistances && creature.resistances.length > 0 && (
          <div className={boxClass}>
            <span className="font-semibold">Resistances:</span>
            <div className="ml-2 mt-1 text-sm text-gray-300">
              <ul className="space-y-1">
                {creature.resistances.map((resistance, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{resistance.type}:</span> {resistance.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Loot Table */}
        {creature.lootTable && Object.keys(creature.lootTable).length > 0 && (
          <div className={boxClass + " col-span-1 md:col-span-2"}>
            <span className="font-semibold">Loot Table:</span>
            <div className="ml-2 mt-1 text-sm text-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(creature.lootTable).map(([roll, loot]) => (
                  <div key={roll} className="border border-zinc-600 rounded p-2">
                    <span className="font-semibold">{roll}:</span> {loot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className={boxClass + " col-span-1 md:col-span-2"}>
          <span className="font-semibold">Notes:</span>
          <textarea
            className="w-full mt-1 p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 min-h-[80px]"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add notes about this creature..."
          />
          <div
            className={`text-green-400 text-xs mt-1 transition-opacity duration-500 ${showSaved ? 'opacity-100' : 'opacity-0'}`}
          >
            Notes saved
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCreatureDisplay; 