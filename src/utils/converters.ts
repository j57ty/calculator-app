import { UnitCategory, UnitCategoryData } from '../types/calculator';

export const UNIT_CATEGORIES: Record<UnitCategory, UnitCategoryData> = {
  length: {
    name: 'Length',
    icon: 'ruler',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', ratio: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', ratio: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratio: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratio: 0.001 },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratio: 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratio: 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratio: 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', ratio: 0.0254 },
    ],
  },
  weight: {
    name: 'Weight',
    icon: 'scale',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ratio: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', ratio: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratio: 0.000001 },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratio: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ratio: 0.028349523125 },
      { id: 'ton', name: 'Metric Ton', symbol: 't', ratio: 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    icon: 'thermometer',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratio: 1, offset: 0 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratio: 5 / 9, offset: -32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratio: 1, offset: -273.15 },
    ],
  },
  speed: {
    name: 'Speed',
    icon: 'speedometer',
    baseUnit: 'm_s',
    units: [
      { id: 'km_h', name: 'Kilometer / hour', symbol: 'km/h', ratio: 1 / 3.6 },
      { id: 'mph', name: 'Miles / hour', symbol: 'mph', ratio: 0.44704 },
      { id: 'm_s', name: 'Meter / second', symbol: 'm/s', ratio: 1 },
      { id: 'knot', name: 'Knot', symbol: 'kn', ratio: 0.514444 },
    ],
  },
  volume: {
    name: 'Volume',
    icon: 'water',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', ratio: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ratio: 0.001 },
      { id: 'gal_us', name: 'US Gallon', symbol: 'gal', ratio: 3.78541 },
      { id: 'cup', name: 'US Cup', symbol: 'cup', ratio: 0.236588 },
      { id: 'fl_oz', name: 'Fluid Ounce', symbol: 'fl oz', ratio: 0.0295735 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratio: 1000 },
    ],
  },
  area: {
    name: 'Area',
    icon: 'grid',
    baseUnit: 'm2',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', ratio: 1 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', ratio: 1e6 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', ratio: 0.092903 },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', ratio: 0.836127 },
      { id: 'acre', name: 'Acre', symbol: 'ac', ratio: 4046.86 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', ratio: 10000 },
    ],
  },
  digital: {
    name: 'Data',
    icon: 'server',
    baseUnit: 'mb',
    units: [
      { id: 'b', name: 'Byte', symbol: 'B', ratio: 1 / (1024 * 1024) },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', ratio: 1 / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', ratio: 1 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', ratio: 1024 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', ratio: 1024 * 1024 },
    ],
  },
  currency: {
    name: 'Currency',
    icon: 'cash',
    baseUnit: 'usd',
    units: [
      { id: 'usd', name: 'US Dollar', symbol: '$ USD', ratio: 1 },
      { id: 'eur', name: 'Euro', symbol: '€ EUR', ratio: 1.08 },
      { id: 'gbp', name: 'British Pound', symbol: '£ GBP', ratio: 1.29 },
      { id: 'jpy', name: 'Japanese Yen', symbol: '¥ JPY', ratio: 0.0066 },
      { id: 'cad', name: 'Canadian Dollar', symbol: '$ CAD', ratio: 0.73 },
      { id: 'aud', name: 'Australian Dollar', symbol: '$ AUD', ratio: 0.65 },
      { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', ratio: 1.13 },
      { id: 'cny', name: 'Chinese Yuan', symbol: '¥ CNY', ratio: 0.14 },
      { id: 'inr', name: 'Indian Rupee', symbol: '₹ INR', ratio: 0.012 },
      { id: 'aed', name: 'UAE Dirham', symbol: 'AED', ratio: 0.27 },
    ],
  },
};

export async function fetchLiveExchangeRates(): Promise<{ rates: Record<string, number>; date: string } | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.rates) {
      // Update ratios in memory
      for (const unit of UNIT_CATEGORIES.currency.units) {
        const uppercaseId = unit.id.toUpperCase();
        if (data.rates[uppercaseId]) {
          // If 1 USD = R units, then 1 unit = 1/R USD
          unit.ratio = 1 / data.rates[uppercaseId];
        }
      }
      return { rates: data.rates, date: data.time_last_update_utc || new Date().toISOString() };
    }
    return null;
  } catch {
    return null;
  }
}

export function convertValue(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): number {
  if (isNaN(value)) return 0;
  if (fromUnitId === toUnitId) return value;

  const cat = UNIT_CATEGORIES[category];
  if (!cat) return value;

  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return value;

  // Temperature special non-linear logic
  if (category === 'temperature') {
    // 1. Convert from source to Celsius
    let celsius = value;
    if (fromUnit.id === 'f') {
      celsius = (value - 32) * (5 / 9);
    } else if (fromUnit.id === 'k') {
      celsius = value - 273.15;
    }

    // 2. Convert from Celsius to target
    if (toUnit.id === 'c') {
      return celsius;
    } else if (toUnit.id === 'f') {
      return (celsius * 9) / 5 + 32;
    } else if (toUnit.id === 'k') {
      return celsius + 273.15;
    }
  }

  // Linear conversion via base ratio
  // baseValue = value * fromRatio
  // targetValue = baseValue / toRatio
  const baseValue = value * fromUnit.ratio;
  const targetValue = baseValue / toUnit.ratio;

  return targetValue;
}
