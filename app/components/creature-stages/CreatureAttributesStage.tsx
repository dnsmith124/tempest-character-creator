"use client";
import { CreatureAttributes } from "@/app/types/creature";

interface CreatureAttributesStageProps {
  attributes: CreatureAttributes;
  onAttributesChange: (attributes: CreatureAttributes) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CreatureAttributesStage = ({ 
  attributes, 
  onAttributesChange, 
  onNext, 
  onBack 
}: CreatureAttributesStageProps) => {
  const getAttributeRating = (value: number): string => {
    if (value <= -1) return "Poor";
    if (value <= 2) return "Average";
    if (value <= 4) return "Above Average";
    if (value <= 6) return "Exemplary";
    return "Incredibly Powerful";
  };

  const getAttributeColor = (value: number): string => {
    if (value <= -1) return "text-red-400";
    if (value <= 2) return "text-yellow-400";
    if (value <= 4) return "text-green-400";
    if (value <= 6) return "text-blue-400";
    return "text-purple-400";
  };

  const handleAttributeChange = (attr: keyof CreatureAttributes, value: string) => {
    const numValue = parseInt(value) || 0;
    onAttributesChange({
      ...attributes,
      [attr]: numValue
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Attributes</h2>
        <p className="text-zinc-300 mb-6">
          Set the creature's core attributes. Values range from -3 to 7+ with different rating levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(['STR', 'AGL', 'MND', 'VIG'] as const).map((attr) => (
          <div key={attr} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor={attr} className="block text-sm font-medium text-zinc-300 mb-2">
              {attr} (Strength)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                id={attr}
                value={attributes[attr]}
                onChange={(e) => handleAttributeChange(attr, e.target.value)}
                min="-3"
                max="10"
                className="w-20 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className={`text-sm font-medium ${getAttributeColor(attributes[attr])}`}>
                  {getAttributeRating(attributes[attr])}
                </div>
                <div className="text-xs text-zinc-400">
                  {attributes[attr] >= 0 ? '+' : ''}{attributes[attr]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Attribute Rating Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-red-400 font-medium">Poor (-3 to -1)</div>
            <div className="text-zinc-400">Significantly below average</div>
          </div>
          <div>
            <div className="text-yellow-400 font-medium">Average (0 to 2)</div>
            <div className="text-zinc-400">Typical for most creatures</div>
          </div>
          <div>
            <div className="text-green-400 font-medium">Above Average (3 to 4)</div>
            <div className="text-zinc-400">Notable strength in this area</div>
          </div>
          <div>
            <div className="text-blue-400 font-medium">Exemplary (5 to 6)</div>
            <div className="text-zinc-400">Exceptional ability</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-purple-400 font-medium">Incredibly Powerful (7+)</div>
            <div className="text-zinc-400">Legendary or supernatural levels</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 