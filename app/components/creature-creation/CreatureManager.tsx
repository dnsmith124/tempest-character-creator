"use client";

import { CreatureCreationForm } from "@/app/components/creature-creation/CreatureCreationForm";

export const CreatureManager = () => {
  const handleCreatureCreated = (newCreature: any) => {
    // Dispatch custom event to update creature count
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('creatureUpdate'));
    }
  };

  return (
    <CreatureCreationForm onCreatureCreated={handleCreatureCreated} />
  );
}; 