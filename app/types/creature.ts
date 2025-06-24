export type CreatureType = 'Minion' | 'Standard' | 'Elite' | 'Boss';

export type CreatureRole = 
  | 'Ambusher' | 'Artillery' | 'Brute' | 'Controller' 
  | 'Leader' | 'Skirmisher' | 'Solo' | 'Soldier' | 'Support';

export type DamageType = 
  | 'Physical' | 'Arcane' | 'Fire' | 'Frost' | 'Lightning' 
  | 'Poison' | 'Acid' | 'Holy' | 'Shadow' | 'Nature' | 'Necrotic';

export interface CreatureAttributes {
  STR: number;
  AGL: number;
  MND: number;
  VIG: number;
}

export interface CreatureAbility {
  name: string;
  description: string;
  type: 'action' | 'reaction' | 'passive';
  uses?: string;
}

export interface CreatureWeapon {
  name: string;
  damage: string; // e.g., "d4", "d6"
  range: number;
  damageType: DamageType;
}

export interface CreatureResistance {
  type: DamageType;
  value: 'resistant' | 'weak' | 'immune';
}

export interface CreatureLootTable {
  [key: number]: string; // 1-6: loot description
}

export interface Creature {
  id: string;
  name: string;
  type: CreatureType;
  attributes: CreatureAttributes;
  hp: number;
  armor: number;
  barrier: number;
  mvmt: number;
  role: CreatureRole;
  weapon: CreatureWeapon;
  abilities: CreatureAbility[];
  quirk: string;
  resistances?: CreatureResistance[];
  lootTable?: CreatureLootTable;
  notes?: string;
  created: Date;
} 