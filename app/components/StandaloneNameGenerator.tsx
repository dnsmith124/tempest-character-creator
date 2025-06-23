"use client";
import { FC, useEffect, useState } from "react";
import { useNameGenerator } from "../hooks/useNameGenerator";

interface StandaloneNameGeneratorProps {
  className?: string;
}

export const StandaloneNameGenerator: FC<StandaloneNameGeneratorProps> = ({ className = "" }) => {
  const [name, setName] = useState("");
  const [selectedAncestry, setSelectedAncestry] = useState("random");
  const [selectedHumanType, setSelectedHumanType] = useState<"Daiman" | "Luminite" | "random">("random");
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "both">("both");
  const [ancestries, setAncestries] = useState<Array<{ name: string }>>([]);
  const [nameHistory, setNameHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { generateName, loading } = useNameGenerator({
    ancestry: selectedAncestry,
    gender: selectedGender,
    humanType: selectedHumanType
  });

  // Load ancestries data
  useEffect(() => {
    const loadAncestries = async () => {
      try {
        const data = await import("../data/ancestries.json");
        setAncestries(data.default || data);
      } catch (e) {
        console.error("Error loading ancestries:", e);
      }
    };
    loadAncestries();
  }, []);

  const handleGenerateName = async () => {
    const generatedName = await generateName();
    
    // Add to history
    const newHistory = [...nameHistory.slice(0, historyIndex + 1), generatedName];
    setNameHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setName(generatedName);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setName(nameHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < nameHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setName(nameHistory[historyIndex + 1]);
    }
  };

  return (
    <div className={`bg-zinc-800 rounded-lg p-6 max-w-md ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Random Name Generator</h2>
      
      <div className="space-y-4">
        {/* Ancestry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ancestry
          </label>
          <select
            value={selectedAncestry}
            onChange={(e) => setSelectedAncestry(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="random">Random</option>
            {ancestries.map((ancestry) => (
              <option key={ancestry.name} value={ancestry.name}>
                {ancestry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Human Type Selection - only show when Human is selected */}
        {selectedAncestry === "Human" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Human Type
            </label>
            <div className="flex gap-2">
              {[
                { value: "random", label: "Random" },
                { value: "Daiman", label: "Daiman" },
                { value: "Luminite", label: "Luminite" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedHumanType(option.value as "Daiman" | "Luminite" | "random")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedHumanType === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender
          </label>
          <div className="flex gap-2">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "both", label: "Both" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value as "male" | "female" | "both")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedGender === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Name Display */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generated Name
          </label>
          <div className="px-3 py-2 rounded bg-zinc-700 text-white min-h-[40px] flex items-center">
            {name || "Click generate to create a name"}
          </div>
        </div>

        {/* Navigation and Generate Buttons */}
        <div className="flex gap-2">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="px-3 py-2 rounded bg-zinc-700 text-gray-300 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous name"
          >
            ←
          </button>
          
          <button
            onClick={goForward}
            disabled={historyIndex >= nameHistory.length - 1}
            className="px-3 py-2 rounded bg-zinc-700 text-gray-300 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next name"
          >
            →
          </button>
          
          <button
            className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleGenerateName}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate New Name"}
          </button>
        </div>

        {/* History Info */}
        {nameHistory.length > 0 && (
          <div className="text-xs text-gray-400 text-center">
            {historyIndex + 1} of {nameHistory.length} names generated
          </div>
        )}
      </div>
    </div>
  );
}; 