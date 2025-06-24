import { FC } from "react";
import traitsData from "@/app/data/traits.json";

interface CurrentSelectionProps {
  name: string;
  ancestry: string;
  background: string;
  kit: string;
  attributes: { STR: number; AGL: number; MND: number; VIG: number };
  ancestryBonus: Partial<{ STR: number; AGL: number; MND: number; VIG: number }>;
  derivedStats: { HP: number; RecoveryDice: number; MVMT: number; Initiative: number; Inventory: number; Memory: number; Armor?: number };
  skills: string[];
  abilities: string[];
  traits: string[];
}

export const CurrentSelection: FC<CurrentSelectionProps> = ({
  name,
  ancestry,
  background,
  kit,
  attributes,
  ancestryBonus,
  derivedStats,
  skills,
  abilities,
  traits,
}) => {
  return (
    <div className="flex-1 max-w-xs w-full p-6 bg-gray-50 dark:bg-zinc-800 rounded shadow mt-4 md:mt-0">
      <h2 className="text-lg font-bold mb-4 dark:text-zinc-100">Current Selection</h2>
      <div className="mb-2"><span className="font-semibold">Name:</span> {name || <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2"><span className="font-semibold">Ancestry:</span> {ancestry || <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2"><span className="font-semibold">Background:</span> {background || <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2"><span className="font-semibold">Kit:</span> {kit || <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2">
        <span className="font-semibold">Attributes:</span>
        <ul className="ml-4">
          <li>STR: {attributes.STR + (ancestryBonus.STR || 0)}</li>
          <li>AGL: {attributes.AGL + (ancestryBonus.AGL || 0)}</li>
          <li>MND: {attributes.MND + (ancestryBonus.MND || 0)}</li>
          <li>VIG: {attributes.VIG + (ancestryBonus.VIG || 0)}</li>
        </ul>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Derived:</span>
        <ul className="ml-4">
          <li>HP: {derivedStats.HP}</li>
          <li>Rec: {derivedStats.RecoveryDice}d4</li>
          <li>MVMT: {derivedStats.MVMT}</li>
          <li>Init: {derivedStats.Initiative}</li>
          <li>Inv: {derivedStats.Inventory}</li>
          <li>Mem: {derivedStats.Memory}</li>
          {derivedStats.Armor ? <li>Armor: {derivedStats.Armor}</li> : null}
        </ul>
      </div>
      <div className="mb-2"><span className="font-semibold">Skills:</span> {skills.length ? skills.join(", ") : <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2"><span className="font-semibold">Abilities/Spells:</span> {abilities.length ? abilities.join(", ") : <span className="text-gray-400">(not set)</span>}</div>
      <div className="mb-2"><span className="font-semibold">Traits:</span> {traits.length ? (
        <ul className="ml-2">
          {traits.map(traitName => {
            const trait = traitsData.positive.find(t => t.name === traitName) || traitsData.negative.find(t => t.name === traitName);
            return trait ? (
              <li key={traitName} className="mb-1">
                <span className="font-semibold">{trait.name}</span>
                <div className="text-xs text-gray-600 dark:text-zinc-400">{trait.description}</div>
              </li>
            ) : (
              <li key={traitName}>{traitName}</li>
            );
          })}
        </ul>
      ) : <span className="text-gray-400">(not set)</span>}</div>
    </div>
  );
}; 