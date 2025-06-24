"use client";
import React, { useState } from "react";
import { FormStage } from "@/app/components/character-stages/FormStage";
import { Modal } from "@/app/components/_common/Modal";
import martialAbilities from "@/app/data/abilities-martial.json";
import nimbleAbilities from "@/app/data/abilities-nimble.json";
import deadeyeAbilities from "@/app/data/abilities-deadeye.json";
import arcaneSpells from "@/app/data/spells-arcane.json";
import holySpells from "@/app/data/spells-holy.json";
import shadowSpells from "@/app/data/spells-shadow.json";
import druidicSpells from "@/app/data/spells-druidic.json";
import fleuromancySpells from "@/app/data/spells-fleuromancy.json";
import musicalAbilities from "@/app/data/abilities-musical.json";
import passiveAbilities from "@/app/data/abilities-passive.json";

type Ability = {
  tier?: number;
  category?: string;
  name: string;
  description: string;
  cost: number | string;
  requirements: {
    attributes?: {
      [key: string]: number | undefined;
    };
    equipment?: string[];
    skills?: {
      [key: string]: number;
    };
  };
};

type Tab = {
  id: string;
  name: string;
  items: Ability[];
};

const tabs: Tab[] = [
  { id: "martial", name: "Martial", items: martialAbilities.abilities as unknown as Ability[] },
  { id: "nimble", name: "Nimble", items: nimbleAbilities.abilities as unknown as Ability[] },
  { id: "deadeye", name: "Deadeye", items: deadeyeAbilities.abilities as unknown as Ability[] },
  { id: "musical", name: "Musical", items: musicalAbilities.abilities as unknown as Ability[] },
  { id: "arcane", name: "Arcane", items: arcaneSpells.spells as unknown as Ability[] },
  { id: "holy", name: "Holy", items: holySpells.spells as unknown as Ability[] },
  { id: "shadow", name: "Shadow", items: shadowSpells.spells as unknown as Ability[] },
  { id: "druidic", name: "Druidic", items: druidicSpells.spells as unknown as Ability[] },
  { id: "fleuromancy", name: "Fleuromancy", items: fleuromancySpells.spells as unknown as Ability[] },
  { id: "passive", name: "Passive", items: passiveAbilities.abilities as unknown as Ability[] },
];

type AbilitiesStageProps = {
  abilities: string[];
  setAbilities: (a: string[]) => void;
  memory: number;
  onNext: () => void;
  onBack: () => void;
  progress: number;
  helpText: string;
  attributes: {
    STR: number;
    VIG: number;
    MND: number;
    AGL: number;
  };
  ancestryBonus?: {
    [key: string]: number;
  }
};

export const AbilitiesStage = ({ abilities, setAbilities, memory, onNext, onBack, progress, helpText, attributes, ancestryBonus }: AbilitiesStageProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  const toggleAbility = (ability: Ability) => {
    if (abilities.includes(ability.name)) {
      setAbilities(abilities.filter(a => a !== ability.name));
    } else if (abilities.length < memory) {
      setAbilities([...abilities, ability.name]);
    }
    setSelectedAbility(null);
  };

  const getAttributeValue = (attr: string): number => {
    const baseValue = attributes[attr as keyof typeof attributes] || 0;
    if (ancestryBonus && ancestryBonus[attr]) {
      return baseValue + ancestryBonus[attr];
    }
    return baseValue;
  };

  const meetsRequirements = (ability: Ability): boolean => {
    if (!ability.requirements.attributes) return true;
    
    return Object.entries(ability.requirements.attributes)
      .filter(([_, value]) => value !== undefined)
      .every(([attr, requiredValue]) => {
        if (requiredValue === undefined) return true;
        const characterValue = getAttributeValue(attr);
        return characterValue >= requiredValue;
      });
  };

  const getTierName = (tier: number): string => {
    switch (tier) {
      case 1: return "Tier I";
      case 2: return "Tier II";
      case 3: return "Tier III";
      case 4: return "Tier IV";
      default: return `Tier -`;
    }
  };

  const renderAbilityList = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    // If it's the passive tab, group by category
    if (activeTab === "passive") {
      const categories = Array.from(new Set(currentTab.items.map(item => item.category))).sort();
      return (
        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = currentTab.items.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoryItems.map(ability => {
                    const isLearnable = meetsRequirements(ability);
                    return (
                      <button
                        key={ability.name}
                        className={`px-2 py-1 rounded border text-left ${
                          abilities.includes(ability.name)
                            ? "bg-blue-500 text-white border-blue-700"
                            : isLearnable
                              ? "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                              : "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => setSelectedAbility(ability)}
                        disabled={!abilities.includes(ability.name) && abilities.length >= memory}
                      >
                        {ability.name}
                        {!isLearnable && <span className="ml-1 text-red-500">*</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // For other tabs, group by tier
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }, (_, i) => i + 1).map(tier => {
          const tierItems = currentTab.items.filter(item => item.tier === tier);
          if (tierItems.length === 0) return null;

          return (
            <div key={tier} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {getTierName(tier)}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {tierItems.map(ability => {
                  const isLearnable = meetsRequirements(ability);
                  return (
                    <button
                      key={ability.name}
                      className={`px-2 py-1 rounded border text-left ${
                        abilities.includes(ability.name)
                          ? "bg-blue-500 text-white border-blue-700"
                          : isLearnable
                            ? "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                            : "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-500"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => setSelectedAbility(ability)}
                      disabled={!abilities.includes(ability.name) && abilities.length >= memory}
                    >
                      {ability.name}
                      {!isLearnable && <span className="ml-1 text-red-500">*</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <FormStage
      title="Select Abilities & Spells"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext} disabled={abilities.length !== memory}>Next</button>
        </>
      }
    >
      <div className="mb-2 text-sm text-gray-500 dark:text-zinc-400">
        Select up to {memory} abilities or spells.
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-3 py-1 rounded border font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Ability List */}
      {renderAbilityList()}

      <div className="mt-4 mb-2">Selected: {abilities.length} / {memory}</div>

      {/* Ability Modal */}
      <Modal
        open={selectedAbility !== null}
        onClose={() => setSelectedAbility(null)}
      >
        {selectedAbility && (
          <>
            <h3 className="text-xl font-bold mb-2">
              {selectedAbility.name}
              {!meetsRequirements(selectedAbility) && (
                <span className="ml-2 text-sm text-red-500">(Requirements not met)</span>
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedAbility.description}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Cost: {selectedAbility.cost}</p>
              {selectedAbility.requirements.attributes && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requirements:{" "}
                  {Object.entries(selectedAbility.requirements.attributes)
                    .filter(([_, value]) => value !== undefined)
                    .map(([attr, value], index, array) => {
                      if (value === undefined) return null;
                      const characterValue = getAttributeValue(attr);
                      const meetsReq = characterValue >= value;
                      return (
                        <React.Fragment key={attr}>
                          <span className={meetsReq ? "" : "text-red-500"}>
                            {attr} {value} (You: {characterValue}
                            {ancestryBonus && ancestryBonus[attr] && ` + ${ancestryBonus[attr]}`}
                            ){meetsReq ? "" : " ✗"}
                          </span>
                          {index < array.length - 1 ? ", " : ""}
                        </React.Fragment>
                      );
                    })}
                </p>
              )}
              {selectedAbility.requirements.skills && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Skills:{" "}
                  {Object.entries(selectedAbility.requirements.skills)
                    .map(([skill, level], index, array) => (
                      <React.Fragment key={skill}>
                        <span>
                          {skill} {level}
                        </span>
                        {index < array.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                </p>
              )}
              {selectedAbility.requirements.equipment && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Equipment: {selectedAbility.requirements.equipment.join(", ")}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setSelectedAbility(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => toggleAbility(selectedAbility)}
                disabled={!meetsRequirements(selectedAbility)}
              >
                {abilities.includes(selectedAbility.name) ? "Remove" : "Select"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </FormStage>
  );
}; 