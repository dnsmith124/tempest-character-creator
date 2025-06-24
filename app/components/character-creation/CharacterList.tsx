"use client";
import { ConfirmDeletePrompt } from "@/app/components/_common/ConfirmDeletePrompt";

interface Character {
  name: string;
  ancestry: string;
  background: string;
  created: number;
  notes?: string;
}

interface CharacterListProps {
  characters: Character[];
  selectedCharacterIdx: number | null;
  deleteIdx: number | null;
  hasCreationState: boolean;
  onSelectCharacter: (idx: number) => void;
  onDeleteCharacter: (idx: number) => void;
  onSetDeleteIdx: (idx: number | null) => void;
  onStartNewCharacter: () => void;
  onResumeCreation: () => void;
}

export const CharacterList = ({
  characters,
  selectedCharacterIdx,
  deleteIdx,
  hasCreationState,
  onSelectCharacter,
  onDeleteCharacter,
  onSetDeleteIdx,
  onStartNewCharacter,
  onResumeCreation,
}: CharacterListProps) => {
  return (
    <div className="flex-1 max-w-xs w-full p-6 bg-gray-50 dark:bg-zinc-800 rounded shadow mt-4 md:mt-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-500 dark:text-zinc-300">Saved Characters</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onStartNewCharacter}
            disabled={false}
          >
            Create
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onResumeCreation}
            disabled={!hasCreationState || selectedCharacterIdx === null}
          >
            Resume
          </button>
        </div>
      </div>
      {characters.length === 0 && <div className="text-gray-400">No characters yet.</div>}
      <ul className="space-y-3">
        {characters.map((char, idx) => (
          <li
            key={char.created || idx}
            className={`p-3 rounded border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 relative group cursor-pointer ${selectedCharacterIdx === idx ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => { onSelectCharacter(idx); }}
          >
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete character"
              onClick={e => { e.stopPropagation(); onSetDeleteIdx(idx); }}
              disabled={false}
            >
              ×
            </button>
            <div className="font-bold text-blue-700 dark:text-blue-300">{char.name || <span className="text-gray-400">(no name)</span>}</div>
            <div className="text-sm text-gray-600 dark:text-zinc-300">{char.ancestry || <span className="text-gray-400">(no ancestry)</span>}</div>
            <div className="text-sm text-gray-600 dark:text-zinc-300">{char.background || <span className="text-gray-400">(no background)</span>}</div>
          </li>
        ))}
      </ul>
      <ConfirmDeletePrompt
        open={deleteIdx !== null}
        onCancel={() => onSetDeleteIdx(null)}
        onConfirm={() => deleteIdx !== null && onDeleteCharacter(deleteIdx)}
        characterName={deleteIdx !== null && characters[deleteIdx] ? characters[deleteIdx].name : "this character"}
      />
    </div>
  );
}; 