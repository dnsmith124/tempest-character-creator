"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Creature, CreatureType, CreatureAttributes, CreatureRole, CreatureWeapon } from "@/app/types/creature";
import { CreatureTypeStage } from "@/app/components/creature-stages/CreatureTypeStage";
import { CreatureBasicStage } from "@/app/components/creature-stages/CreatureBasicStage";
import { CreatureAttributesStage } from "@/app/components/creature-stages/CreatureAttributesStage";
import { CreatureCombatStage } from "@/app/components/creature-stages/CreatureCombatStage";
import { CreatureAbilitiesStage } from "@/app/components/creature-stages/CreatureAbilitiesStage";
import { CreatureDetailsStage } from "@/app/components/creature-stages/CreatureDetailsStage";
import { CreatureSummaryStage } from "@/app/components/creature-stages/CreatureSummaryStage";
import { CreatureList } from "@/app/components/creature-creation/CreatureList";
import SelectedCreatureDisplay from "@/app/components/creature-creation/SelectedCreatureDisplay";
import debounce from "lodash.debounce";

const TOTAL_STAGES = 6;
const STORAGE_KEY = "tempest-creatures";

interface CreatureCreationFormProps {
  onCreatureCreated: (creature: Creature) => void;
}

export const CreatureCreationForm = ({ onCreatureCreated }: CreatureCreationFormProps) => {
  const [stage, setStage] = useState(0);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedCreatureIdx, setSelectedCreatureIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [shouldSaveNotes, setShouldSaveNotes] = useState(false);
  
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

  const creationStateRef = useRef<any>(null);

  // Load creatures from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedCreatures = JSON.parse(saved);
        // Convert created field back to Date objects
        const creaturesWithDates = parsedCreatures.map((creature: any) => ({
          ...creature,
          created: creature.created ? new Date(creature.created) : new Date()
        }));
        setCreatures(creaturesWithDates);
      }
    }
  }, []);

  // When a creature is selected, load its notes
  useEffect(() => {
    if (selectedCreatureIdx !== null && creatures[selectedCreatureIdx]) 
      setNotes(creatures[selectedCreatureIdx].notes || "");
  }, [selectedCreatureIdx, creatures]);

  // Save notes to localStorage when edited (debounced)
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setShouldSaveNotes(true);
  };

  const creaturesRef = useRef(creatures);

  useEffect(() => {
    creaturesRef.current = creatures;
  }, [creatures]);
  
  // Create stable debounced function once
  const debouncedSaveNotes = useMemo(() => {
    return debounce((notes: string, selectedCreatureIdx: number) => {
      if (selectedCreatureIdx === null) return;
  
      const updatedCreatures = creaturesRef.current.map((creature, idx) =>
        idx === selectedCreatureIdx ? { ...creature, notes } : creature
      );
  
      setCreatures(updatedCreatures);
      setShowSaved(true);
      setShouldSaveNotes(false);
      console.log("Saving notes...");
  
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCreatures));
      }
    }, 500);
  }, []);
  
  useEffect(() => {
    if (selectedCreatureIdx !== null && shouldSaveNotes)
      debouncedSaveNotes(notes, selectedCreatureIdx);
  
    return () => {
      debouncedSaveNotes.cancel();
    };
  }, [notes, selectedCreatureIdx, shouldSaveNotes]);

  useEffect(() => {
    if(showSaved === false)
      return;
    
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [showSaved]);

  // Delete creature handler
  const handleDelete = (idx: number) => {
    const updated = creatures.filter((_, i) => i !== idx);
    setCreatures(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setDeleteIdx(null);
    // If deleted creature was selected, clear selection
    if (selectedCreatureIdx === idx) setSelectedCreatureIdx(null);
  };

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
      notes: "",
      created: new Date()
    };

    const updatedCreatures = [...creatures, newCreature];
    setCreatures(updatedCreatures);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCreatures));
    onCreatureCreated(newCreature);
    
    // Select the new creature for viewing
    setSelectedCreatureIdx(updatedCreatures.length - 1);
    
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

  // When switching from creating to viewing, save the current creation state
  useEffect(() => {
    if (selectedCreatureIdx !== null) {
      creationStateRef.current = stage === 0 
      ? null
      : {
        stage,
        creatureType,
        name,
        attributes,
        hp,
        armor,
        barrier,
        mvmt,
        role,
        weapon,
        abilities,
        quirk,
        resistances,
        lootTable,
      };
    }
  }, [selectedCreatureIdx]);

  // When switching back to creating, restore the saved creation state if available
  useEffect(() => {
    if (selectedCreatureIdx === null && creationStateRef.current) {
      const s = creationStateRef.current;
      setStage(s.stage);
      setCreatureType(s.creatureType);
      setName(s.name);
      setAttributes(s.attributes);
      setHp(s.hp);
      setArmor(s.armor);
      setBarrier(s.barrier);
      setMvmt(s.mvmt);
      setRole(s.role);
      setWeapon(s.weapon);
      setAbilities(s.abilities);
      setQuirk(s.quirk);
      setResistances(s.resistances);
      setLootTable(s.lootTable);
    }
  }, [selectedCreatureIdx]);

  // Only reset state when starting a new creature
  const startNewCreature = () => {
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
    setSelectedCreatureIdx(null);
    creationStateRef.current = null;
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
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Creature List Section */}
        <CreatureList
          creatures={creatures}
          selectedCreatureIdx={selectedCreatureIdx}
          deleteIdx={deleteIdx}
          hasCreationState={!!creationStateRef.current}
          onSelectCreature={(idx: number) => setSelectedCreatureIdx(idx)}
          onDeleteCreature={(idx: number) => handleDelete(idx)}
          onSetDeleteIdx={(idx: number | null) => setDeleteIdx(idx)}
          onStartNewCreature={startNewCreature}
          onResumeCreation={() => { setSelectedCreatureIdx(null); }}
        />

        {/* Center Section: Form or Details */}
        <div className={`flex-1 mx-auto p-8 bg-zinc-900 rounded shadow flex flex-col gap-3 min-h-[400px] transition-all duration-300 ${selectedCreatureIdx !== null ? 'max-w-4xl' : 'max-w-4xl'}`}>
          {selectedCreatureIdx === null ? (
            <>
              <h1 className="text-3xl font-bold text-zinc-100 mb-2">Creature Creator</h1>
              
              {/* Progress indicator */}
              <div className="mb-2">
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
            </>
          ) : (
            creatures[selectedCreatureIdx] && (
              <SelectedCreatureDisplay
                creature={creatures[selectedCreatureIdx]}
                notes={notes}
                handleNotesChange={handleNotesChange}
                showSaved={showSaved}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}; 