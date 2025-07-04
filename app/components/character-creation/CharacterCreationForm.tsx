"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AttributeStage } from "@/app/components/character-stages/AttributeStage";
import { DerivedStatsStage } from "@/app/components/character-stages/DerivedStatsStage";
import { AncestryStage } from "@/app/components/character-stages/AncestryStage";
import { BackgroundStage } from "@/app/components/character-stages/BackgroundStage";
import { SkillsStage } from "@/app/components/character-stages/SkillsStage";
import { KitStage } from "@/app/components/character-stages/KitStage";
import { AbilitiesStage } from "@/app/components/character-stages/AbilitiesStage";
import { TraitsStage } from "@/app/components/character-stages/TraitsStage";
import { CharacterList } from "@/app/components/character-creation/CharacterList";
import debounce from "lodash.debounce";
import kits from "@/app/data/kits.json";
import backgrounds from "@/app/data/backgrounds.json";
import { CurrentSelection } from "@/app/components/character-creation/CurrentSelection";
import SelectedCharacterDisplay from "@/app/components/character-creation/SelectedCharacterDisplay";

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
    import("@/app/data/ancestries.json").then((mod) => setAncestriesList(mod.default || mod));
  }, []);
  return ancestriesList;
};

interface CharacterCreationFormProps {
  onCharacterCreated: (character: any) => void;
}

export const CharacterCreationForm = ({ onCharacterCreated }: CharacterCreationFormProps) => {
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
    import("@/app/data/backgrounds.json").then((mod) => {
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

  // Save character and call callback on submit
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
    onCharacterCreated(newChar);
    setSubmitted(true);
  };

  // Handle viewing the newly created character
  const handleViewCharacter = () => {
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
    
    // Add to characters list
    const updatedCharacters = [...characters, newChar];
    setCharacters(updatedCharacters);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacters));
    }
    
    // Select the new character for viewing
    setSelectedCharacterIdx(updatedCharacters.length - 1);
    setSubmitted(false);
  };

  // When switching from creating to viewing, save the current creation state
  useEffect(() => {
    if (selectedCharacterIdx !== null) {
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
  }, [selectedCharacterIdx]);

  // When switching back to creating, restore the saved creation state if available
  useEffect(() => {
    if (selectedCharacterIdx === null && creationStateRef.current) {
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
  }, [selectedCharacterIdx]);

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
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => {
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
            }}
          >
            Create Another
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleViewCharacter}
            disabled={false}
          >
            View Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Character List Section */}
        <CharacterList
          characters={characters}
          selectedCharacterIdx={selectedCharacterIdx}
          deleteIdx={deleteIdx}
          hasCreationState={!!creationStateRef.current}
          onSelectCharacter={(idx: number) => setSelectedCharacterIdx(idx)}
          onDeleteCharacter={(idx: number) => handleDelete(idx)}
          onSetDeleteIdx={(idx: number | null) => setDeleteIdx(idx)}
          onStartNewCharacter={startNewCharacter}
          onResumeCreation={() => { setSelectedCharacterIdx(null); }}
        />

        {/* Center Section: Form or Details or Message */}
        <div className={`flex-1 mx-auto p-8 bg-zinc-900 rounded shadow flex flex-col gap-3 min-h-[400px] transition-all duration-300 ${selectedCharacterIdx !== null ? 'max-w-4xl' : 'max-w-2xl'}`}>
          {selectedCharacterIdx === null && (
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
          {selectedCharacterIdx !== null && characters[selectedCharacterIdx] && (
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
        {selectedCharacterIdx === null && (
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
    </div>
  );
}; 