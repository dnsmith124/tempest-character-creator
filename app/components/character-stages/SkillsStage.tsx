"use client";
import { useEffect, useState } from "react";
import { FormStage } from "@/app/components/character-stages/FormStage";

export const SkillsStage = ({ skills, setSkills, onNext, onBack, progress, helpText }: any) => {
  const [skillData, setSkillData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const maxSkills = 6;

  useEffect(() => {
    import("../../data/skills.json")
      .then((mod) => {
        const data = mod.default || mod;
        setSkillData(data);
        // Set default selected category to the first one
        setSelectedCategory(Object.keys(data)[0] || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <FormStage title="Select Skills" progress={progress} helpText={helpText}><div>Loading skills...</div></FormStage>;
  }

  const categories = Object.keys(skillData);
  const skillsList = skillData[selectedCategory] || [];

  return (
    <FormStage
      title="Select Skills"
      progress={progress}
      helpText={helpText}
      actions={
        <>
          <button className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed" onClick={onBack}>Back</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" onClick={onNext} disabled={skills.length !== maxSkills}>Next</button>
        </>
      }
    >
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded border font-semibold transition-colors ${selectedCategory === category ? "bg-blue-600 text-white border-blue-700" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}`}
            onClick={() => setSelectedCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      {/* Skills for selected tab */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{selectedCategory}</h3>
        <ul className="grid gap-2">
          {(skillsList as any[]).map((skill) => {
            const checked = skills.includes(skill.name);
            const disabled = !checked && skills.length >= maxSkills;
            return (
              <li
                key={skill.name}
                className={`flex flex-col gap-1 p-3 rounded cursor-pointer border transition-colors select-none
                  ${checked ? "bg-blue-100 dark:bg-blue-900 border-blue-400" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50 dark:hover:bg-zinc-800"}`}
                onClick={() => {
                  if (disabled) return;
                  if (checked) {
                    setSkills(skills.filter((s: string) => s !== skill.name));
                  } else {
                    setSkills([...skills, skill.name]);
                  }
                }}
                aria-disabled={disabled}
              >
                <span className="font-semibold text-base flex items-center">
                  {skill.name}
                  {checked && (
                    <span className="ml-2 text-blue-600 dark:text-blue-300 text-xs font-bold">Selected</span>
                  )}
                </span>
                {skill.description && (() => {
                  // Split description into sentences
                  const sentences = skill.description.match(/[^.!?]+[.!?]?/g) || [skill.description];
                  const lastIdx = sentences.length - 1;
                  return (
                    <span className="block text-sm text-zinc-400">
                      {sentences.map((sentence: string, idx: number) =>
                        idx === lastIdx ? (
                          <b key={idx} className="text-zinc-300 ml-1">{sentence.trim()}</b>
                        ) : (
                          <span key={idx}>{sentence}</span>
                        )
                      )}
                    </span>
                  );
                })()}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mb-2">Selected: {skills.length} / {maxSkills}</div>
    </FormStage>
  );
}; 