import React, { useEffect, useState } from "react";

interface RandomNameGeneratorProps {
  ancestry: string;
  buttonOnly?: boolean;
  gender: "male" | "female";
  onGenerate?: (name: string) => void;
}

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const RandomNameGenerator: React.FC<RandomNameGeneratorProps> = ({ ancestry, buttonOnly = false, gender, onGenerate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const generateName = async () => {
    setLoading(true);
    try {
      const data = gender === "male"
        ? await import("../data/male_name_fragments.json")
        : await import("../data/female_name_fragments.json");
      const fragments: Record<string, any> = data.default || data;
      const frag = fragments[ancestry];
      if (!frag) {
        setName("No data for ancestry");
        setLoading(false);
        return;
      }
      const firstPrefix = getRandom(frag.first.prefix);
      const firstSuffix = getRandom(frag.first.suffix);
      const lastPrefix = getRandom(frag.last.prefix);
      const lastSuffix = getRandom(frag.last.suffix);
      let generated = `${firstPrefix}${firstSuffix}`;
      if (lastPrefix !== "N/A" && lastSuffix !== "N/A") {
        generated += ` ${lastPrefix}${lastSuffix}`;
      }
      setName(generated);
      if (onGenerate) onGenerate(generated);
    } catch (e) {
      setName("Error loading name data");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (ancestry && gender) {
      generateName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ancestry, gender]);

  return (
    <div className="flex flex-col gap-2 items-start">
      {
        !buttonOnly &&
        <>        
          <div className="font-semibold">Random Name:</div>
          <div className="mb-2 px-3 py-2 rounded bg-zinc-800 text-white min-w-[180px]">{name}</div>
        </>
      }
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={generateName}
        disabled={loading || !ancestry || !gender}
      >
        {loading ? "Generating..." : "Generate New Name"}
      </button>
    </div>
  );
}; 