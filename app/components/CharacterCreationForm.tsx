"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AttributeStage } from "./stages/AttributeStage";
import { DerivedStatsStage } from "./stages/DerivedStatsStage";
import { AncestryStage } from "./stages/AncestryStage";
import { BackgroundStage } from "./stages/BackgroundStage";
import { SkillsStage } from "./stages/SkillsStage";
import { KitStage } from "./stages/KitStage";
import { AbilitiesStage } from "./stages/AbilitiesStage";
import { TraitsStage } from "./stages/TraitsStage";
import { ConfirmDeletePrompt } from "./ConfirmDeletePrompt";
import debounce from "lodash.debounce";
import kits from "../data/kits.json";
import backgrounds from "../data/backgrounds.json";
import { CurrentSelection } from "./CurrentSelection";
import SelectedCharacterDisplay from "./SelectedCharacterDisplay";

const TOTAL_STAGES = 8;
const STORAGE_KEY = "tempest-characters";

// Utility to parse ancestry effect string and return a bonus object
function parseAncestryEffect(effect: string): { [key: string]: number } {
  if (!effect) return {};
  const bonuses: { [key: string]: number } = {};
  // Match patterns like '+1 STR', '+2 HP', '+2 Armor', '+1 Initiative', '+1 Memory', etc.
  const regex = /([+-]?\d+)\s*(STR|AGL|MND|VIG|HP|Armor|Initiative|Memory)/gi;
  let match;
  while ((match = regex.exec(effect))) {
    const value = parseInt(match[1], 10);
    const stat = match[2];
    bonuses[stat] = (bonuses[stat] || 0) + value;
  }
  return bonuses;
}

// Memoized ancestry bonus lookup
const useAncestryBonus = (
  ancestry: string,
  ancestriesList: { name: string; effect: string; ability: string }[]
): { [key: string]: number } => {
  return useMemo(() => {
    if (!ancestry || !ancestriesList?.length) return {};
    const found = ancestriesList.find((a) => a.name === ancestry);
    if (!found) return {};
    return parseAncestryEffect(found.effect);
  }, [ancestry, ancestriesList]);
};

// Load ancestries.json for use in summary and details
const useAncestriesList = () => {
  const [ancestriesList, setAncestriesList] = useState<{ name: string; effect: string; ability: string }[]>([]);
  useEffect(() => {
    import("../data/ancestries.json").then((mod) => setAncestriesList(mod.default || mod));
  }, []);
  return ancestriesList;
};

export const CharacterCreationForm = () => {
  // All state for the form
  const [stage, setStage] = useState(0);
  // Attribute assignment
  const [attributes, setAttributes] = useState<{ STR: number; AGL: number; MND: number; VIG: number }>({ STR: 0, AGL: 0, MND: 0, VIG: 0 });
  const [attributeMethod, setAttributeMethod] = useState<"standard"|"random"|null>(null);
  // Ancestry
  const [ancestry, setAncestry] = useState<string>("");
  // Load ancestries.json for use in summary and details
  const ancestriesList = useAncestriesList();
  const ancestryBonus = useAncestryBonus(ancestry, ancestriesList);
  // Derived stats
  const derivedStats = useMemo(() => {
    const bonus = ancestryBonus;
    const adj = (stat: string, base: number) => base + (bonus[stat] || 0);
    const adjAttr = (attr: "STR" | "AGL" | "MND" | "VIG") => attributes[attr] + (bonus[attr] || 0);
    return {
      HP: adj("HP", Math.max(adjAttr("VIG"), 0) * 2 + 5),
      RecoveryDice: Math.max(1, adjAttr("VIG")),
      MVMT: Math.max(3, Math.min(8, 3 + adjAttr("AGL"))),
      Initiative: adj("Initiative", adjAttr("AGL") + adjAttr("MND")),
      Inventory: Math.max(5, 5 + adjAttr("STR")),
      Memory: Math.max(1, adj("Memory", Math.max(1, adjAttr("MND")))),
      Armor: adj("Armor", 0),
      Languages: 1, // Placeholder, should be based on Linguistics skill
    };
  }, [attributes, ancestryBonus]);
  // Background
  const [background, setBackground] = useState<string>("");
  // Track the previous background to remove its skill if changed
  const [prevBackground, setPrevBackground] = useState<string>("");
  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  // Kit
  const [kit, setKit] = useState<string>("");
  // Abilities & Spells
  const [abilities, setAbilities] = useState<string[]>([]);
  // Traits & Name
  const [traits, setTraits] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCharacterIdx, setSelectedCharacterIdx] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [shouldSaveNotes, setShouldSaveNotes] = useState(false);

  const creationStateRef = useRef<any>(null);

  // Load characters from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCharacters(JSON.parse(saved));
      }
    }
  }, []);

  // When a character is selected, load its notes
  useEffect(() => {
    if (selectedCharacterIdx !== null && characters[selectedCharacterIdx]) 
      setNotes(characters[selectedCharacterIdx].notes || "");
  }, [selectedCharacterIdx, characters]);

  // Save notes to localStorage when edited (debounced)
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setShouldSaveNotes(true);
  };
  const charactersRef = useRef(characters);

  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);
  
  // Create stable debounced function once
  const debouncedSaveNotes = useMemo(() => {
    return debounce((notes: string, selectedCharacterIdx: number) => {
      if (selectedCharacterIdx === null) return;
  
      const updatedCharacters = charactersRef.current.map((char, idx) =>
        idx === selectedCharacterIdx ? { ...char, notes } : char
      );
  
      setCharacters(updatedCharacters);
      setShowSaved(true);
      setShouldSaveNotes(false);
      console.log("Saving notes...");
  
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacters));
      }
    }, 500);
  }, []);
  
  useEffect(() => {
    if (selectedCharacterIdx !== null && shouldSaveNotes)
      debouncedSaveNotes(notes, selectedCharacterIdx);
  
    return () => {
      debouncedSaveNotes.cancel();
    };
  }, [notes, selectedCharacterIdx, shouldSaveNotes]);

  useEffect(() => {
    if(showSaved === false)
      return;
    
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [showSaved]);

  // Ensure background skill is always included in skills
  useEffect(() => {
    if (!background) return;
    import("../data/backgrounds.json").then((mod) => {
      const backgrounds = mod.default || mod;
      const bg = backgrounds.find((b: any) => b.name === background);
      const prevBg = backgrounds.find((b: any) => b.name === prevBackground);
      if (!bg) return;
      let newSkills = skills.filter(s => !prevBg || s !== prevBg.skill);
      if (!newSkills.includes(bg.skill)) {
        // If already at 5, replace the previous background skill if present, otherwise don't add
        if (newSkills.length >= 5) {
          // Only replace if previous background skill was present
          if (prevBg && skills.includes(prevBg.skill)) {
            newSkills = newSkills.slice(0, 4);
            newSkills.push(bg.skill);
          }
        } else {
          newSkills.push(bg.skill);
        }
      }
      setSkills(newSkills);
      setPrevBackground(background);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [background]);

  // Delete character handler
  const handleDelete = (idx: number) => {
    const updated = characters.filter((_, i) => i !== idx);
    setCharacters(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setDeleteIdx(null);
    // If deleted character was selected, clear selection
    if (selectedCharacterIdx === idx) setSelectedCharacterIdx(null);
  };

  // Save character to localStorage on submit
  const handleSubmit = () => {
    const newChar = {
      name,
      ancestry,
      background,
      attributes,
      derivedStats,
      skills,
      kit,
      abilities,
      traits,
      notes: "",
      created: Date.now(),
    };
    const updated = [newChar, ...characters];
    setCharacters(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setSubmitted(true);
    setIsCreating(false);
    setSelectedCharacterIdx(0); // Show the newly created character
  };

  // When switching from creating to viewing, save the current creation state
  useEffect(() => {
    if (!isCreating) {
      creationStateRef.current = stage === 0 
      ? null
      : {
        stage,
        attributes,
        attributeMethod,
        ancestry,
        background,
        prevBackground,
        skills,
        kit,
        abilities,
        traits,
        name,
      };
    }
  }, [isCreating]);

  // When switching back to creating, restore the saved creation state if available
  useEffect(() => {
    if (isCreating && creationStateRef.current) {
      const s = creationStateRef.current;
      setStage(s.stage);
      setAttributes(s.attributes);
      setAttributeMethod(s.attributeMethod);
      setAncestry(s.ancestry);
      setBackground(s.background);
      setPrevBackground(s.prevBackground);
      setSkills(s.skills);
      setKit(s.kit);
      setAbilities(s.abilities);
      setTraits(s.traits);
      setName(s.name);
    }
  }, [isCreating]);

  // Only reset state when starting a new character
  const startNewCharacter = () => {
    setStage(0);
    setName("");
    setTraits([]);
    setAbilities([]);
    setKit("");
    setSkills([]);
    setBackground("");
    setAncestry("");
    setAttributes({STR:0,AGL:0,MND:0,VIG:0});
    setAttributeMethod(null);
    setSubmitted(false);
    setIsCreating(true);
    setSelectedCharacterIdx(null);
    creationStateRef.current = null;
  };

  const progress = stage / (TOTAL_STAGES - 1);
  const helpTexts = [
    "Assign your starting attributes using the standard spread or random roll.",
    "Choose your ancestry. Each ancestry has unique bonuses.",
    "Review your derived stats, calculated from your attributes and ancestry.",
    "Select your character's background.",
    "Pick 5 skill proficiencies (2 combat recommended).",
    "Choose a starting kit.",
    "Select abilities and spells up to your Memory stat.",
    "Enter your character's name, then select two traits.",
  ];

  if (submitted) {
    return (
      <div className="p-8 dark:bg-gray-800 bg-green-100 rounded shadow text-center mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-2">Character Created!</h2>
        <p className="mb-4">Your character <span className="font-semibold">{name}</span> has been created.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={startNewCharacter}>Create Another</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => { setSubmitted(false); setIsCreating(false); creationStateRef.current = null; }}>View Character</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
      {/* Character List Section */}
      <div className="flex-1 max-w-xs w-full p-6 bg-gray-50 dark:bg-zinc-800 rounded shadow mt-4 md:mt-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-500 dark:text-zinc-300">Saved Characters</h2>
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={startNewCharacter}
              disabled={false}
            >
              Create
            </button>
            <button
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => { setIsCreating(true); setSelectedCharacterIdx(null); }}
              disabled={!creationStateRef.current || isCreating}
            >
              Resume
            </button>
          </div>
        </div>
        {characters.length === 0 && <div className="text-gray-400">No characters yet.</div>}
        <ul className="space-y-3">
          {characters.map((char, idx) => (
            <li
              key={char.created || idx}
              className={`p-3 rounded border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 relative group cursor-pointer ${selectedCharacterIdx === idx ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => { setSelectedCharacterIdx(idx); setIsCreating(false); }}
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete character"
                onClick={e => { e.stopPropagation(); setDeleteIdx(idx); }}
                disabled={false}
              >
                ×
              </button>
              <div className="font-bold text-blue-700 dark:text-blue-300">{char.name || <span className="text-gray-400">(no name)</span>}</div>
              <div className="text-sm text-gray-600 dark:text-zinc-300">{char.ancestry || <span className="text-gray-400">(no ancestry)</span>}</div>
              <div className="text-sm text-gray-600 dark:text-zinc-300">{char.background || <span className="text-gray-400">(no background)</span>}</div>
            </li>
          ))}
        </ul>
        <ConfirmDeletePrompt
          open={deleteIdx !== null}
          onCancel={() => setDeleteIdx(null)}
          onConfirm={() => deleteIdx !== null && handleDelete(deleteIdx)}
          characterName={deleteIdx !== null && characters[deleteIdx] ? characters[deleteIdx].name : "this character"}
        />
      </div>
      {/* Center Section: Form or Details or Message */}
      <div className={`flex-1 mx-auto p-8 bg-zinc-900 rounded shadow flex flex-col gap-6 min-h-[400px] transition-all duration-300 ${selectedCharacterIdx !== null && !isCreating ? 'max-w-4xl' : 'max-w-2xl'}`}>
        {!isCreating && selectedCharacterIdx === null && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-zinc-300">
            <div className="text-xl font-semibold mb-2">Select an existing character or create a new one</div>
          </div>
        )}
        {isCreating && !submitted && (
          <>
            <h1 className="text-2xl font-bold mb-4 dark:text-zinc-100">Create Your Character</h1>
            {stage === 0 && (
              <AttributeStage
                attributes={attributes}
                setAttributes={setAttributes}
                attributeMethod={attributeMethod}
                setAttributeMethod={setAttributeMethod}
                onNext={() => setStage(1)}
                progress={progress}
                helpText={helpTexts[0]}
              />
            )}
            {stage === 1 && (
              <AncestryStage
                ancestry={ancestry}
                setAncestry={setAncestry}
                onNext={() => setStage(2)}
                onBack={() => setStage(0)}
                progress={progress}
                helpText={helpTexts[1]}
              />
            )}
            {stage === 2 && (
              <DerivedStatsStage
                derivedStats={derivedStats}
                onNext={() => setStage(3)}
                onBack={() => setStage(1)}
                progress={progress}
                helpText={helpTexts[2]}
              />
            )}
            {stage === 3 && (
              <BackgroundStage
                background={background}
                setBackground={setBackground}
                onNext={() => setStage(4)}
                onBack={() => setStage(2)}
                progress={progress}
                helpText={helpTexts[3]}
              />
            )}
            {stage === 4 && (
              <SkillsStage
                skills={skills}
                setSkills={setSkills}
                onNext={() => setStage(5)}
                onBack={() => setStage(3)}
                progress={progress}
                helpText={helpTexts[4]}
              />
            )}
            {stage === 5 && (
              <KitStage
                kit={kit}
                setKit={setKit}
                onNext={() => setStage(6)}
                onBack={() => setStage(4)}
                progress={progress}
                helpText={helpTexts[5]}
              />
            )}
            {stage === 6 && (
              <AbilitiesStage
                abilities={abilities}
                attributes={attributes}
                setAbilities={setAbilities}
                memory={derivedStats.Memory}
                onNext={() => setStage(7)}
                onBack={() => setStage(5)}
                progress={progress}
                helpText={helpTexts[6]}
                ancestryBonus={ancestryBonus}
              />
            )}
            {stage === 7 && (
              <TraitsStage
                ancestry={ancestry}
                traits={traits}
                setTraits={setTraits}
                name={name}
                setName={setName}
                onBack={() => setStage(6)}
                onSubmit={handleSubmit}
                progress={progress}
                helpText={helpTexts[7]}
              />
            )}
          </>
        )}
        {selectedCharacterIdx !== null && !isCreating && characters[selectedCharacterIdx] && (
          <SelectedCharacterDisplay
            character={characters[selectedCharacterIdx]}
            ancestriesList={ancestriesList}
            backgrounds={backgrounds}
            kits={kits}
            notes={notes}
            handleNotesChange={handleNotesChange}
            showSaved={showSaved}
          />
        )}
      </div>
      {/* Live Summary Section */}
      {isCreating && (
        <CurrentSelection
          name={name}
          ancestry={ancestry}
          background={background}
          kit={kit}
          attributes={attributes}
          ancestryBonus={ancestryBonus}
          derivedStats={derivedStats}
          skills={skills}
          abilities={abilities}
          traits={traits}
        />
      )}
    </div>
  );
}; 