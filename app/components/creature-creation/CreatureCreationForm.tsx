"use client";
import { useState, useEffect } from "react";
import { Creature, CreatureType, CreatureAttributes, CreatureRole, CreatureWeapon } from "@/app/types/creature";
import { CreatureTypeStage } from "@/app/components/creature-stages/CreatureTypeStage";
import { CreatureBasicStage } from "@/app/components/creature-stages/CreatureBasicStage";
import { CreatureAttributesStage } from "@/app/components/creature-stages/CreatureAttributesStage";
import { CreatureCombatStage } from "@/app/components/creature-stages/CreatureCombatStage";
import { CreatureAbilitiesStage } from "@/app/components/creature-stages/CreatureAbilitiesStage";
import { CreatureDetailsStage } from "@/app/components/creature-stages/CreatureDetailsStage";
import { CreatureSummaryStage } from "@/app/components/creature-stages/CreatureSummaryStage";

const TOTAL_STAGES = 6;
const STORAGE_KEY = "tempest-creatures";

interface CreatureCreationFormProps {
  onCreatureCreated: (creature: Creature) => void;
}

export const CreatureCreationForm = ({ onCreatureCreated }: CreatureCreationFormProps) => {
  const [stage, setStage] = useState(0);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedCreatureIdx, setSelectedCreatureIdx] = useState<number | null>(null);
  
  // Creature creation state
  const [creatureType, setCreatureType] = useState<CreatureType | null>(null);
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<CreatureAttributes>({ STR: 0, AGL: 0, MND: 0, VIG: 0 });
  const [hp, setHp] = useState(1);
  const [armor, setArmor] = useState(0);
  const [barrier, setBarrier] = useState(0);
  const [mvmt, setMvmt] = useState(3);
  const [role, setRole] = useState<CreatureRole | null>(null);
  const [weapon, setWeapon] = useState<CreatureWeapon>({ 
    name: "", 
    damage: "d4", 
    range: 1, 
    damageType: "Physical" 
  });
  const [abilities, setAbilities] = useState<any[]>([]);
  const [quirk, setQuirk] = useState("");
  const [resistances, setResistances] = useState<any[]>([]);
  const [lootTable, setLootTable] = useState<{[key: number]: string}>({});

  // Load creatures from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCreatures(JSON.parse(saved));
      }
    }
  }, []);

  const handleSubmit = () => {
    const newCreature: Creature = {
      id: Date.now().toString(),
      name,
      type: creatureType!,
      attributes,
      hp,
      armor,
      barrier,
      mvmt,
      role: creatureType === 'Minion' ? 'Soldier' : role!,
      weapon,
      abilities,
      quirk,
      resistances,
      lootTable,
      created: new Date()
    };

    const updatedCreatures = [...creatures, newCreature];
    setCreatures(updatedCreatures);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCreatures));
    onCreatureCreated(newCreature);
    
    // Reset form
    setStage(0);
    setCreatureType(null);
    setName("");
    setAttributes({ STR: 0, AGL: 0, MND: 0, VIG: 0 });
    setHp(1);
    setArmor(0);
    setBarrier(0);
    setMvmt(3);
    setRole(null);
    setWeapon({ name: "", damage: "d4", range: 1, damageType: "Physical" });
    setAbilities([]);
    setQuirk("");
    setResistances([]);
    setLootTable({});
  };

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <CreatureTypeStage
            creatureType={creatureType}
            onTypeChange={setCreatureType}
            onNext={() => setStage(1)}
          />
        );
      case 1:
        return (
          <CreatureBasicStage
            name={name}
            onNameChange={setName}
            creatureType={creatureType!}
            onNext={() => setStage(2)}
            onBack={() => setStage(0)}
          />
        );
      case 2:
        return (
          <CreatureAttributesStage
            attributes={attributes}
            onAttributesChange={setAttributes}
            onNext={() => setStage(3)}
            onBack={() => setStage(1)}
          />
        );
      case 3:
        return (
          <CreatureCombatStage
            hp={hp}
            armor={armor}
            barrier={barrier}
            mvmt={mvmt}
            role={role}
            weapon={weapon}
            creatureType={creatureType!}
            onHpChange={setHp}
            onArmorChange={setArmor}
            onBarrierChange={setBarrier}
            onMvmtChange={setMvmt}
            onRoleChange={setRole}
            onWeaponChange={setWeapon}
            onNext={() => setStage(4)}
            onBack={() => setStage(2)}
          />
        );
      case 4:
        return (
          <CreatureAbilitiesStage
            abilities={abilities}
            creatureType={creatureType!}
            onAbilitiesChange={setAbilities}
            onNext={() => setStage(5)}
            onBack={() => setStage(3)}
          />
        );
      case 5:
        return (
          <CreatureDetailsStage
            quirk={quirk}
            resistances={resistances}
            lootTable={lootTable}
            onQuirkChange={setQuirk}
            onResistancesChange={setResistances}
            onLootTableChange={setLootTable}
            onNext={() => setStage(6)}
            onBack={() => setStage(4)}
          />
        );
      case 6:
        return (
          <CreatureSummaryStage
            creature={{
              id: "",
              name,
              type: creatureType!,
              attributes,
              hp,
              armor,
              barrier,
              mvmt,
              role: creatureType === 'Minion' ? 'Soldier' : role!,
              weapon,
              abilities,
              quirk,
              resistances,
              lootTable,
              created: new Date()
            }}
            onSubmit={handleSubmit}
            onBack={() => setStage(5)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Creature Creator</h1>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: TOTAL_STAGES }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= stage 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-700 text-zinc-400'
                }`}>
                  {i + 1}
                </div>
                {i < TOTAL_STAGES - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i < stage ? 'bg-blue-600' : 'bg-zinc-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {renderStage()}
      </div>
    </div>
  );
}; 