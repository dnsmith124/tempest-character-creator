"use client";

import { CharacterCreationForm } from "./CharacterCreationForm";

export const CharacterManager = () => {
  const handleCharacterCreated = (newCharacter: any) => {
    // Dispatch custom event to update character count
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('characterUpdate'));
    }
  };

  return (
    <CharacterCreationForm onCharacterCreated={handleCharacterCreated} />
  );
}; 