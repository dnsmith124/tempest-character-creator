"use client";

import { useState, useEffect } from "react";
import { Navigation, NavigationTab } from "./components/Navigation";
import { CharacterManager } from "./components/CharacterManager";
import { NameGeneratorPage } from "./components/NameGeneratorPage";
import { Settings } from "./components/Settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('characters');
  const [characterCount, setCharacterCount] = useState(0);

  // Load character count from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tempest-characters");
      if (saved) {
        const characters = JSON.parse(saved);
        setCharacterCount(characters.length);
      }
    }
  }, []);

  // Update character count when characters change
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("tempest-characters");
        if (saved) {
          const characters = JSON.parse(saved);
          setCharacterCount(characters.length);
        } else {
          setCharacterCount(0);
        }
      }
    };

    const handleCharacterUpdate = () => {
      handleStorageChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('characterUpdate', handleCharacterUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('characterUpdate', handleCharacterUpdate);
    };
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'characters':
        return <CharacterManager />;
      case 'name-generator':
        return <NameGeneratorPage />;
      case 'settings':
        return <Settings />;
      default:
        return <CharacterManager />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        characterCount={characterCount}
      />
      <main>
        {renderActiveTab()}
      </main>
    </div>
  );
}
