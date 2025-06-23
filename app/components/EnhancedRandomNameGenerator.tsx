import React, { useState } from "react";
import { useNameGenerator } from "../hooks/useNameGenerator";

interface EnhancedRandomNameGeneratorProps {
  ancestry: string;
  buttonOnly?: boolean;
  onGenerate?: (name: string) => void;
  showHumanType?: boolean;
  showGenderSelection?: boolean;
}

export const EnhancedRandomNameGenerator: React.FC<EnhancedRandomNameGeneratorProps> = ({ 
  ancestry, 
  buttonOnly = false, 
  onGenerate,
  showHumanType = true,
  showGenderSelection = true
}) => {
  const [name, setName] = useState("");
  const [selectedHumanType, setSelectedHumanType] = useState<"Daiman" | "Luminite" | "random">("random");
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "both">("both");

  const { generateName, loading } = useNameGenerator({
    ancestry,
    gender: selectedGender,
    humanType: ancestry === "Human" ? selectedHumanType : "random"
  });

  const handleGenerate = async () => {
    const generatedName = await generateName();
    setName(generatedName);
    if (onGenerate) onGenerate(generatedName);
  };

  React.useEffect(() => {
    if (ancestry && selectedGender) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ancestry, selectedGender, selectedHumanType]);

  return (
    <div className="flex flex-col gap-2 items-start">
      {/* Gender Selection - only show when showGenderSelection is true */}
      {showGenderSelection && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Gender
          </label>
          <div className="flex gap-1">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "both", label: "Both" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value as "male" | "female" | "both")}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
      )}

      {/* Human Type Selection - only show when Human is selected and showHumanType is true */}
      {ancestry === "Human" && showHumanType && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Human Type
          </label>
          <div className="flex gap-1">
            {[
              { value: "random", label: "Random" },
              { value: "Daiman", label: "Daiman" },
              { value: "Luminite", label: "Luminite" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedHumanType(option.value as "Daiman" | "Luminite" | "random")}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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

      {!buttonOnly && (
        <>
          <div className="font-semibold">Random Name:</div>
          <div className="mb-2 px-3 py-2 rounded bg-zinc-800 text-white min-w-[180px]">{name}</div>
        </>
      )}
      
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleGenerate}
        disabled={loading || !ancestry || !selectedGender}
      >
        {loading ? "Generating..." : "Generate New Name"}
      </button>
    </div>
  );
}; 