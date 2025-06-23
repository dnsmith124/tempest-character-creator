import { useState } from "react";

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface UseNameGeneratorProps {
  ancestry: string;
  gender: "male" | "female" | "both";
  humanType?: "Daiman" | "Luminite" | "random";
}

export const useNameGenerator = ({ ancestry, gender, humanType = "random" }: UseNameGeneratorProps) => {
  const [loading, setLoading] = useState(false);

  const generateName = async (): Promise<string> => {
    setLoading(true);
    try {
      let generatedName = "";
      
      if (gender === "both") {
        // Generate both male and female names and combine them
        const maleData = await import("../data/male_name_fragments.json");
        const femaleData = await import("../data/female_name_fragments.json");
        const maleFragments: Record<string, any> = maleData.default || maleData;
        const femaleFragments: Record<string, any> = femaleData.default || femaleData;
        
        let targetAncestry = ancestry;
        
        // Handle Human sub-selection
        if (ancestry === "Human") {
          if (humanType === "random") {
            targetAncestry = Math.random() < 0.5 ? "Human (Daiman)" : "Human (Luminite)";
          } else {
            targetAncestry = `Human (${humanType})`;
          }
        }
        
        const maleFrag = maleFragments[targetAncestry];
        const femaleFrag = femaleFragments[targetAncestry];
        
        if (!maleFrag || !femaleFrag) {
          generatedName = "No data for selected ancestry";
        } else {
          // Generate male first name
          const maleFirstPrefix = getRandom(maleFrag.first.prefix);
          const maleFirstSuffix = getRandom(maleFrag.first.suffix);
          const maleFirstName = `${maleFirstPrefix}${maleFirstSuffix}`;
          
          // Generate female last name
          const femaleLastPrefix = getRandom(femaleFrag.last.prefix);
          const femaleLastSuffix = getRandom(femaleFrag.last.suffix);
          const femaleLastName = femaleLastPrefix !== "N/A" && femaleLastSuffix !== "N/A" 
            ? `${femaleLastPrefix}${femaleLastSuffix}` 
            : "";
          
          generatedName = `${maleFirstName} ${femaleLastName}`.trim();
        }
      } else {
        // Generate single gender name
        const data = gender === "male"
          ? await import("../data/male_name_fragments.json")
          : await import("../data/female_name_fragments.json");
        const fragments: Record<string, any> = data.default || data;
        
        let targetAncestry = ancestry;
        
        // Handle Human sub-selection
        if (ancestry === "Human") {
          if (humanType === "random") {
            targetAncestry = Math.random() < 0.5 ? "Human (Daiman)" : "Human (Luminite)";
          } else {
            targetAncestry = `Human (${humanType})`;
          }
        }
        
        const frag = fragments[targetAncestry];
        if (!frag) {
          generatedName = "No data for selected ancestry";
        } else {
          const firstPrefix = getRandom(frag.first.prefix);
          const firstSuffix = getRandom(frag.first.suffix);
          const lastPrefix = getRandom(frag.last.prefix);
          const lastSuffix = getRandom(frag.last.suffix);
          
          generatedName = `${firstPrefix}${firstSuffix}`;
          if (lastPrefix !== "N/A" && lastSuffix !== "N/A") {
            generatedName += ` ${lastPrefix}${lastSuffix}`;
          }
        }
      }
      
      setLoading(false);
      return generatedName;
    } catch (e) {
      setLoading(false);
      return "Error loading name data";
    }
  };

  return {
    generateName,
    loading
  };
}; 