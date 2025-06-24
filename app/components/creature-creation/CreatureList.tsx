"use client";
import { ConfirmDeletePrompt } from "@/app/components/_common/ConfirmDeletePrompt";
import { Creature } from "@/app/types/creature";

interface CreatureListProps {
  creatures: Creature[];
  selectedCreatureIdx: number | null;
  deleteIdx: number | null;
  hasCreationState: boolean;
  onSelectCreature: (idx: number) => void;
  onDeleteCreature: (idx: number) => void;
  onSetDeleteIdx: (idx: number | null) => void;
  onStartNewCreature: () => void;
  onResumeCreation: () => void;
}

export const CreatureList = ({
  creatures,
  selectedCreatureIdx,
  deleteIdx,
  hasCreationState,
  onSelectCreature,
  onDeleteCreature,
  onSetDeleteIdx,
  onStartNewCreature,
  onResumeCreation,
}: CreatureListProps) => {
  return (
    <div className="flex-1 max-w-xs w-full p-6 bg-gray-50 dark:bg-zinc-800 rounded shadow mt-4 md:mt-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-500 dark:text-zinc-300">Saved Creatures</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onStartNewCreature}
            disabled={false}
          >
            Create
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onResumeCreation}
            disabled={!hasCreationState || selectedCreatureIdx === null}
          >
            Resume
          </button>
        </div>
      </div>
      {creatures.length === 0 && <div className="text-gray-400">No creatures yet.</div>}
      <ul className="space-y-3">
        {creatures.map((creature, idx) => {
          // Handle both Date objects and string timestamps from localStorage
          const createdTime = creature.created instanceof Date 
            ? creature.created.getTime() 
            : typeof creature.created === 'string' 
              ? new Date(creature.created).getTime() 
              : creature.created;
          
          return (
            <li
              key={createdTime || idx}
              className={`p-3 rounded border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 relative group cursor-pointer ${selectedCreatureIdx === idx ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => { onSelectCreature(idx); }}
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete creature"
                onClick={e => { e.stopPropagation(); onSetDeleteIdx(idx); }}
                disabled={false}
              >
                ×
              </button>
              <div className="font-bold text-blue-700 dark:text-blue-300">{creature.name || <span className="text-gray-400">(no name)</span>}</div>
              <div className="text-sm text-gray-600 dark:text-zinc-300">{creature.type || <span className="text-gray-400">(no type)</span>}</div>
              <div className="text-sm text-gray-600 dark:text-zinc-300">{creature.role || <span className="text-gray-400">(no role)</span>}</div>
              <div className="text-xs text-gray-500 dark:text-zinc-400">HP: {creature.hp}</div>
            </li>
          );
        })}
      </ul>
      <ConfirmDeletePrompt
        open={deleteIdx !== null}
        onCancel={() => onSetDeleteIdx(null)}
        onConfirm={() => deleteIdx !== null && onDeleteCreature(deleteIdx)}
        characterName={deleteIdx !== null && creatures[deleteIdx] ? creatures[deleteIdx].name : "this creature"}
      />
    </div>
  );
}; 