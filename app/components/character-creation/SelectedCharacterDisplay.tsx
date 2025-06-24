import React from 'react';
import traitsData from "@/app/data/traits.json";

function parseAncestryEffect(effect: string): { [key: string]: number } {
  // Simple parser for effects like "STR+1, HP+2"
  const result: { [key: string]: number } = {};
  effect.split(',').forEach(part => {
    const match = part.trim().match(/([A-Z][A-Za-z]*)([+-]\d+)/);
    if (match) {
      result[match[1]] = (result[match[1]] || 0) + parseInt(match[2], 10);
    }
  });
  return result;
}

const boxClass = "bg-zinc-800 border border-zinc-700 rounded p-4 shadow";

const SelectedCharacterDisplay = ({
  character,
  ancestriesList,
  backgrounds,
  kits,
  notes,
  handleNotesChange,
  showSaved
}: {
  character: any,
  ancestriesList: any[],
  backgrounds: any[],
  kits: any[],
  notes: string,
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  showSaved: boolean
}) => {
  const foundAncestry = ancestriesList.find(a => a.name === character.ancestry);
  const ancestryBonus = foundAncestry ? parseAncestryEffect(foundAncestry.effect) : {};
  const attrs = character.attributes;
  const derived = {
    HP: (attrs.VIG + (ancestryBonus.VIG || 0)) * 2 + 5 + (ancestryBonus.HP || 0),
    RecoveryDice: Math.max(1, attrs.VIG + (ancestryBonus.VIG || 0)),
    MVMT: Math.max(3, Math.min(8, 3 + attrs.AGL + (ancestryBonus.AGL || 0))),
    Initiative: attrs.AGL + attrs.MND + (ancestryBonus.AGL || 0) + (ancestryBonus.MND || 0) + (ancestryBonus.Initiative || 0),
    Inventory: Math.max(5, 5 + attrs.STR + (ancestryBonus.STR || 0)),
    Memory: Math.max(1, attrs.MND + (ancestryBonus.MND || 0) + (ancestryBonus.Memory || 0)),
    Armor: ancestryBonus.Armor || 0
  };
  const bg = backgrounds.find(b => b.name === character.background);
  const kitObj = kits.find(k => k.name === character.kit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-zinc-100">{character.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attributes - move to top */}
        <div className={boxClass}>
          <span className="font-semibold">Attributes:</span>
          <div className="ml-2 mt-1 grid grid-cols-2 gap-1 text-sm text-gray-300">
            <div>STR: {attrs.STR + (ancestryBonus.STR || 0)}</div>
            <div>AGL: {attrs.AGL + (ancestryBonus.AGL || 0)}</div>
            <div>MND: {attrs.MND + (ancestryBonus.MND || 0)}</div>
            <div>VIG: {attrs.VIG + (ancestryBonus.VIG || 0)}</div>
          </div>
        </div>
        {/* Derived - move to top */}
        <div className={boxClass}>
          <span className="font-semibold">Derived:</span>
          <div className="ml-2 mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 text-sm text-gray-300">
            <div>HP: {derived.HP}</div>
            <div>Rec: {derived.RecoveryDice}d4</div>
            <div>MVMT: {derived.MVMT}</div>
            <div>Init: {derived.Initiative}</div>
            <div>Inv: {derived.Inventory}</div>
            <div>Mem: {derived.Memory}</div>
            {derived.Armor ? <div>Armor: {derived.Armor}</div> : null}
          </div>
        </div>
        {/* Ancestry */}
        <div className={boxClass}>
          <span className="font-semibold">Ancestry:</span> {character.ancestry}
          {foundAncestry && (
            <div className="mt-1 text-sm text-gray-300 whitespace-pre-line">
              <div><span className="font-semibold">Effect:</span> {foundAncestry.effect}</div>
              <div><span className="font-semibold">Ability:</span> {foundAncestry.ability}</div>
            </div>
          )}
        </div>
        {/* Background */}
        <div className={boxClass}>
          <span className="font-semibold">Background:</span> {character.background}
          {bg && (
            <div className="mt-1 text-sm text-gray-300 whitespace-pre-line">
              <div><span className="font-semibold">Skill:</span> {bg.skill}</div>
              <div><span className="font-semibold">Effect:</span> {bg.effect}</div>
              <div><span className="font-semibold">Description:</span> {bg.description}</div>
            </div>
          )}
        </div>
        {/* Kit */}
        <div className={boxClass}>
          <span className="font-semibold">Kit:</span> {character.kit}
          {kitObj && kitObj.items && kitObj.items.length > 0 && (
            <ul className="list-disc ml-6 mt-1 text-sm text-gray-300">
              {kitObj.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* Skills - 3 column grid */}
        <div className={boxClass}>
          <span className="font-semibold">Skills:</span>
          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 text-sm text-gray-300">
            {character.skills.map((skill: string, idx: number) => (
              <div key={idx} className="truncate">{skill}</div>
            ))}
          </div>
        </div>
        {/* Abilities/Spells */}
        <div className={boxClass}>
          <span className="font-semibold">Abilities/Spells:</span>
          <div className="mt-1 text-sm text-gray-300">{character.abilities.join(", ")}</div>
        </div>
        {/* Traits */}
        <div className={boxClass}>
          <span className="font-semibold">Traits:</span>
          <div className="mt-1 text-sm text-gray-300">
            <ul>
              {character.traits.map((traitName: string) => {
                const trait = traitsData.positive.find(t => t.name === traitName) || traitsData.negative.find(t => t.name === traitName);
                return trait ? (
                  <li key={traitName} className="mb-1">
                    <span className="font-semibold">{trait.name}</span>
                    <div className="text-xs text-gray-400">{trait.description}</div>
                  </li>
                ) : (
                  <li key={traitName}>{traitName}</li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* Notes */}
        <div className={boxClass + " col-span-1 md:col-span-2"}>
          <span className="font-semibold">Notes:</span>
          <textarea
            className="w-full mt-1 p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 min-h-[80px]"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add notes about this character..."
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

export default SelectedCharacterDisplay; 