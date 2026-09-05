export type CalculatorMode = 'standard' | 'scientific' | 'converter';

export type AngleMode = 'DEG' | 'RAD';

export type ThemeMode = 'dark' | 'light';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'scientific' | 'equals';

export interface KeypadButton {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
  secondaryLabel?: string;
}

export type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'speed' 
  | 'volume' 
  | 'area' 
  | 'digital' 
  | 'currency';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratio: number;
  offset?: number;
}

export interface UnitCategoryData {
  name: string;
  icon: string;
  baseUnit: string;
  units: UnitDefinition[];
}
