"use client";
import { FormStage } from "./FormStage";
import { useState } from "react";

type AttributeStageProps = {
  attributes: { STR: number; AGL: number; MND: number; VIG: number };
  setAttributes: (a: { STR: number; AGL: number; MND: number; VIG: number }) => void;
  attributeMethod: "standard" | "random" | null;
  setAttributeMethod: (m: "standard" | "random") => void;
  onNext: () => void;
  progress: number;
  helpText: string;
};

const spreadValues = [1, 1, 0, -1];
const attrKeys = ["STR", "AGL", "MND", "VIG"] as const;
type AttrKey = typeof attrKeys[number];

type SpreadAssignment = { [K in AttrKey]?: number };

type ValueAssignment = { value: number; index: number };

function getAvailableValueIndices(
  assignments: { [K in AttrKey]?: number },
  currentAttr: AttrKey,
  value: number,
  valueIndex: number,
  valueIndices: ValueAssignment[]
) {
  // Find which value indices are already assigned to other attributes
  const usedIndices: { [key: string]: boolean } = {};
  for (const attr of attrKeys) {
    if (attr === currentAttr) continue;
    const assigned = assignments[attr];
    if (assigned !== undefined) {
      // Find the first unmarked index for this value
      for (let i = 0; i < valueIndices.length; i++) {
        if (
          valueIndices[i].value === assigned &&
          !usedIndices[`${assigned}-${i}`]
        ) {
          usedIndices[`${assigned}-${i}`] = true;
          break;
        }
      }
    }
  }
  // For this value and index, check if it's already used by another attribute
  return !usedIndices[`${value}-${valueIndex}`];
}

export const AttributeStage = ({ attributes, setAttributes, attributeMethod, setAttributeMethod, onNext, progress, helpText }: AttributeStageProps) => {
  const [rolls, setRolls] = useState<number[]>([]);
  const [bonus, setBonus] = useState<null | AttrKey>(null);
  const [spreadAssignment, setSpreadAssignment] = useState<SpreadAssignment>({});
  // For each attribute, store which value index is assigned (to distinguish between the two 1s)
  const [valueIndicesAssignment, setValueIndicesAssignment] = useState<{ [K in AttrKey]?: number }>({});

  // For UI: build value indices for the spread
  const valueIndices: ValueAssignment[] = spreadValues.map((value, index) => ({ value, index }));

  // For UI: which value indices are already assigned
  const assignedPairs = Object.entries(valueIndicesAssignment).map(
    ([attr, idx]) => `${spreadAssignment[attr as AttrKey]}:${idx}`
  );

  // Handle standard spread assignment
  const handleSpreadAssign = (attr: AttrKey, selected: string) => {
    if (selected === "") {
      // Unassign
      const updated = { ...spreadAssignment };
      const updatedIndices = { ...valueIndicesAssignment };
      delete updated[attr];
      delete updatedIndices[attr];
      setSpreadAssignment(updated);
      setValueIndicesAssignment(updatedIndices);
      setBonus(null);
      setAttributes({
        STR: updated.STR ?? 0,
        AGL: updated.AGL ?? 0,
        MND: updated.MND ?? 0,
        VIG: updated.VIG ?? 0,
      });
      return;
    }
    // selected is in the form "value:index" (all as strings)
    const [valStr, idxStr] = selected.split(":");
    const value = parseInt(valStr, 10);
    const valueIndex = parseInt(idxStr, 10);
    // Remove this value index from any other attribute
    const updatedIndices = { ...valueIndicesAssignment };
    for (const k of attrKeys) {
      if (k !== attr && updatedIndices[k] === valueIndex && spreadAssignment[k] === value) {
        delete updatedIndices[k];
      }
    }
    updatedIndices[attr] = valueIndex;
    // Assign value to attribute
    const updated = { ...spreadAssignment };
    updated[attr] = value;
    setSpreadAssignment(updated);
    setValueIndicesAssignment(updatedIndices);
    setAttributes({
      STR: updated.STR ?? 0,
      AGL: updated.AGL ?? 0,
      MND: updated.MND ?? 0,
      VIG: updated.VIG ?? 0,
    });
    // If all assigned, reset bonus
    if (Object.values(updated).filter(v => v !== undefined).length === 4) {
      setBonus(null);
    }
  };

  // Handle bonus for standard spread
  const handleBonus = (attr: AttrKey) => {
    // Remove previous bonus if any
    let base = { ...attributes };
    if (bonus) {
      base[bonus] = base[bonus] - 1;
    }
    base[attr] = base[attr] + 1;
    setAttributes(base);
    setBonus(attr);
  };

  // Handle random roll
  const handleRandomRoll = () => {
    const newRolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 4));
    setRolls(newRolls);
    // Apply rolls
    let base = { STR: 0, AGL: 0, MND: 0, VIG: 0 };
    for (let i = 0; i < 4; i++) {
      const attr = attrKeys[newRolls[i] - 1];
      if (i < 3) base[attr] += 1;
      else base[attr] -= 1;
    }
    setAttributes(base);
    setBonus(null);
    setSpreadAssignment({});
    setValueIndicesAssignment({});
  };

  // Reset standard spread
  const handleStandardStart = () => {
    setAttributeMethod("standard");
    setAttributes({ STR: 0, AGL: 0, MND: 0, VIG: 0 });
    setBonus(null);
    setRolls([]);
    setSpreadAssignment({});
    setValueIndicesAssignment({});
  };

  // Reset random roll
  const handleRandomStart = () => {
    setAttributeMethod("random");
    setRolls([]);
    setBonus(null);
    setAttributes({ STR: 0, AGL: 0, MND: 0, VIG: 0 });
    setSpreadAssignment({});
    setValueIndicesAssignment({});
  };

  const canProceed =
    attributeMethod !== null &&
    ((attributeMethod === "standard" && Object.values(spreadAssignment).filter(v => v !== undefined).length === 4 && !!bonus) ||
      (attributeMethod === "random" && rolls.length === 4));

  return (
    <FormStage
      title="Assign Attributes"
      progress={progress}
      helpText={helpText}
      actions={
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next
        </button>
      }
    >
      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded border ${attributeMethod === "standard" ? "bg-blue-500 text-white" : ""}`}
          onClick={handleStandardStart}
        >
          Standard Spread
        </button>
        <button
          className={`px-3 py-1 rounded border ${attributeMethod === "random" ? "bg-blue-500 text-white" : ""}`}
          onClick={handleRandomStart}
        >
          Random Roll
        </button>
      </div>
      {attributeMethod === "standard" && (
        <div>
          <div className="mb-2">Assign each value to an attribute:</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {attrKeys.map(attr => (
              <div key={attr} className="flex flex-col">
                <label className="font-semibold mb-1">{attr}</label>
                <select
                  className="border rounded px-2 py-1"
                  value={
                    valueIndicesAssignment[attr] !== undefined
                      ? `${spreadAssignment[attr]}:${valueIndicesAssignment[attr]}`
                      : ""
                  }
                  onChange={e => handleSpreadAssign(attr, e.target.value)}
                  disabled={!!bonus}
                >
                  <option value="">Select</option>
                  {valueIndices.map(({ value, index }) => (
                    <option
                      key={`${value}:${index}`}
                      value={`${value}:${index}`}
                      disabled={
                        assignedPairs.includes(`${value}:${index}`) &&
                        valueIndicesAssignment[attr] !== index
                      }
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {Object.values(spreadAssignment).filter(v => v !== undefined).length === 4 && !bonus && (
            <div className="mb-2">Increase one attribute by 1:</div>
          )}
          <div className="flex gap-2">
            {Object.values(spreadAssignment).filter(v => v !== undefined).length === 4 &&
              attrKeys.map(attr => (
                <button
                  key={attr}
                  className={`px-2 py-1 rounded border ${bonus === attr ? "bg-green-500 text-white" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handleBonus(attr)}
                  disabled={false}
                >
                  +1 {attr}
                </button>
              ))}
          </div>
        </div>
      )}
      {attributeMethod === "random" && (
        <div>
          <button className="mb-2 px-3 py-1 rounded border" onClick={handleRandomRoll}>Roll d4 x4</button>
          {rolls.length > 0 && (
            <div className="mb-2">Rolls: {rolls.join(", ")}</div>
          )}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {attrKeys.map(attr => (
              <div key={attr} className="flex flex-col">
                <label className="font-semibold">{attr}</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  value={attributes[attr]}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </FormStage>
  );
}; 