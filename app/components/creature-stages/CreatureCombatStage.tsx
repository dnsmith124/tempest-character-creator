"use client";
import { useState, useEffect } from "react";
import { CreatureRole, CreatureWeapon, DamageType, CreatureType } from "@/app/types/creature";
import creatureRoles from "@/app/data/creature-roles.json";
import damageTypes from "@/app/data/damage-types.json";

interface CreatureCombatStageProps {
  hp: number;
  armor: number;
  barrier: number;
  mvmt: number;
  role: CreatureRole | null;
  weapon: CreatureWeapon;
  creatureType: CreatureType;
  onHpChange: (hp: number) => void;
  onArmorChange: (armor: number) => void;
  onBarrierChange: (barrier: number) => void;
  onMvmtChange: (mvmt: number) => void;
  onRoleChange: (role: CreatureRole) => void;
  onWeaponChange: (weapon: CreatureWeapon) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CreatureCombatStage = ({
  hp,
  armor,
  barrier,
  mvmt,
  role,
  weapon,
  creatureType,
  onHpChange,
  onArmorChange,
  onBarrierChange,
  onMvmtChange,
  onRoleChange,
  onWeaponChange,
  onNext,
  onBack
}: CreatureCombatStageProps) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [damageTypesList, setDamageTypesList] = useState<string[]>([]);

  useEffect(() => {
    setRoles(creatureRoles.roles);
    setDamageTypesList(damageTypes.damage_types);
  }, []);

  const handleWeaponChange = (field: keyof CreatureWeapon, value: string | number) => {
    onWeaponChange({
      ...weapon,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Combat Statistics</h2>
        <p className="text-zinc-300 mb-6">
          Define the creature's combat capabilities, role, and weapon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* HP, Armor, Barrier, Movement */}
        <div className="space-y-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor="hp" className="block text-sm font-medium text-zinc-300 mb-2">
              Hit Points (HP)
            </label>
            <input
              type="number"
              id="hp"
              value={hp}
              onChange={(e) => onHpChange(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor="armor" className="block text-sm font-medium text-zinc-300 mb-2">
              Armor
            </label>
            <input
              type="number"
              id="armor"
              value={armor}
              onChange={(e) => onArmorChange(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor="barrier" className="block text-sm font-medium text-zinc-300 mb-2">
              Barrier
            </label>
            <input
              type="number"
              id="barrier"
              value={barrier}
              onChange={(e) => onBarrierChange(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor="mvmt" className="block text-sm font-medium text-zinc-300 mb-2">
              Movement (MVMT)
            </label>
            <input
              type="number"
              id="mvmt"
              value={mvmt}
              onChange={(e) => onMvmtChange(parseInt(e.target.value) || 3)}
              min="1"
              max="10"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Role and Weapon */}
        <div className="space-y-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <label htmlFor="role" className="block text-sm font-medium text-zinc-300 mb-2">
              Role
            </label>
            {creatureType === 'Minion' ? (
              <p className="text-sm text-zinc-400 mt-2">
                Minions do not have a role.
              </p>
            ) : (
              <select
                id="role"
                value={role || ""}
                onChange={(e) => onRoleChange(e.target.value as CreatureRole)}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                {roles.map((roleOption) => (
                  <option key={roleOption.name} value={roleOption.name}>
                    {roleOption.name}
                  </option>
                ))}
              </select>
            )}
            {role && (
              <p className="text-sm text-zinc-400 mt-2">
                {roles.find(r => r.name === role)?.description}
              </p>
            )}
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">Weapon</h3>
            
            <div>
              <label htmlFor="weapon-name" className="block text-sm font-medium text-zinc-300 mb-1">
                Weapon Name
              </label>
              <input
                type="text"
                id="weapon-name"
                value={weapon.name}
                onChange={(e) => handleWeaponChange('name', e.target.value)}
                placeholder="e.g., Sharpened Stick, Fire Breath"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="weapon-damage" className="block text-sm font-medium text-zinc-300 mb-1">
                  Damage
                </label>
                <select
                  id="weapon-damage"
                  value={weapon.damage}
                  onChange={(e) => handleWeaponChange('damage', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="d4">d4</option>
                  <option value="d6">d6</option>
                  <option value="d8">d8</option>
                  <option value="d10">d10</option>
                  <option value="d12">d12</option>
                  <option value="2d4">2d4</option>
                  <option value="2d6">2d6</option>
                  <option value="2d8">2d8</option>
                </select>
              </div>

              <div>
                <label htmlFor="weapon-range" className="block text-sm font-medium text-zinc-300 mb-1">
                  Range
                </label>
                <input
                  type="number"
                  id="weapon-range"
                  value={weapon.range}
                  onChange={(e) => handleWeaponChange('range', parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="weapon-damage-type" className="block text-sm font-medium text-zinc-300 mb-1">
                Damage Type
              </label>
              <select
                id="weapon-damage-type"
                value={weapon.damageType}
                onChange={(e) => handleWeaponChange('damageType', e.target.value as DamageType)}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {damageTypesList.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
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
          disabled={creatureType === 'Minion' ? !weapon.name.trim() : (!role || !weapon.name.trim())}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            (creatureType === 'Minion' ? weapon.name.trim() : (role && weapon.name.trim()))
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}; 