export type MaterialKey = 'cement' | 'blocks' | 'iron' | 'sand' | 'granite' | 'roofing' | 'tiles' | 'paint';

export interface MaterialData {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface CountryConfig {
  name: string;
  flag: string;
  currency: string;
  locale: string;
  symbol: string;
  /** Cost per sqm in local currency for standard finish */
  baseCostPerSqm: number;
  materials: Record<MaterialKey, { name: string; unit: string; unitPrice: number }>;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  NG: {
    name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', locale: 'en-NG', symbol: '₦',
    baseCostPerSqm: 320000,
    materials: {
      cement:  { name: 'Cement',        unit: 'Bags',    unitPrice: 9500 },
      blocks:  { name: 'Blocks',         unit: 'Units',   unitPrice: 500 },
      iron:    { name: 'Iron Rods',      unit: 'Tons',    unitPrice: 1200000 },
      sand:    { name: 'Sand',           unit: 'Trips',   unitPrice: 150000 },
      granite: { name: 'Granite',        unit: 'Trips',   unitPrice: 180000 },
      roofing: { name: 'Roofing Sheet',  unit: 'sqm',     unitPrice: 15000 },
      tiles:   { name: 'Tiles',          unit: 'sqm',     unitPrice: 8000 },
      paint:   { name: 'Paint',          unit: 'Buckets', unitPrice: 35000 },
    },
  },
  GH: {
    name: 'Ghana', flag: '🇬🇭', currency: 'GHS', locale: 'en-GH', symbol: 'GH₵',
    baseCostPerSqm: 2800,
    materials: {
      cement:  { name: 'Cement',        unit: 'Bags',    unitPrice: 85 },
      blocks:  { name: 'Blocks',         unit: 'Units',   unitPrice: 4.5 },
      iron:    { name: 'Iron Rods',      unit: 'Tons',    unitPrice: 10500 },
      sand:    { name: 'Sand',           unit: 'Loads',   unitPrice: 1200 },
      granite: { name: 'Granite',        unit: 'Loads',   unitPrice: 1500 },
      roofing: { name: 'Roofing Sheet',  unit: 'sqm',     unitPrice: 130 },
      tiles:   { name: 'Tiles',          unit: 'sqm',     unitPrice: 70 },
      paint:   { name: 'Paint',          unit: 'Tins',    unitPrice: 320 },
    },
  },
  KE: {
    name: 'Kenya', flag: '🇰🇪', currency: 'KES', locale: 'en-KE', symbol: 'KSh',
    baseCostPerSqm: 42000,
    materials: {
      cement:  { name: 'Cement',        unit: 'Bags',    unitPrice: 700 },
      blocks:  { name: 'Blocks',         unit: 'Units',   unitPrice: 55 },
      iron:    { name: 'Iron Rods',      unit: 'Tons',    unitPrice: 145000 },
      sand:    { name: 'Sand',           unit: 'Loads',   unitPrice: 18000 },
      granite: { name: 'Granite',        unit: 'Loads',   unitPrice: 22000 },
      roofing: { name: 'Roofing Sheet',  unit: 'sqm',     unitPrice: 1800 },
      tiles:   { name: 'Tiles',          unit: 'sqm',     unitPrice: 950 },
      paint:   { name: 'Paint',          unit: 'Tins',    unitPrice: 4200 },
    },
  },
  ZA: {
    name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', locale: 'en-ZA', symbol: 'R',
    baseCostPerSqm: 12000,
    materials: {
      cement:  { name: 'Cement',        unit: 'Bags',    unitPrice: 180 },
      blocks:  { name: 'Bricks',         unit: 'Units',   unitPrice: 4.5 },
      iron:    { name: 'Steel Rod',      unit: 'Tons',    unitPrice: 28000 },
      sand:    { name: 'River Sand',     unit: 'm³',      unitPrice: 900 },
      granite: { name: 'Stone',          unit: 'm³',      unitPrice: 1200 },
      roofing: { name: 'IBR Roofing',    unit: 'sqm',     unitPrice: 280 },
      tiles:   { name: 'Tiles',          unit: 'sqm',     unitPrice: 220 },
      paint:   { name: 'Paint',          unit: '5L Tin',  unitPrice: 650 },
    },
  },
  AE: {
    name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', locale: 'en-AE', symbol: 'AED',
    baseCostPerSqm: 3200,
    materials: {
      cement:  { name: 'Cement',        unit: 'Bags',    unitPrice: 40 },
      blocks:  { name: 'Hollow Blocks', unit: 'Units',   unitPrice: 3.5 },
      iron:    { name: 'Steel Rebar',   unit: 'Tons',    unitPrice: 4500 },
      sand:    { name: 'Washed Sand',   unit: 'm³',      unitPrice: 120 },
      granite: { name: 'Aggregate',     unit: 'm³',      unitPrice: 150 },
      roofing: { name: 'Waterproofing', unit: 'sqm',     unitPrice: 85 },
      tiles:   { name: 'Porcelain Tile',unit: 'sqm',     unitPrice: 180 },
      paint:   { name: 'Paint',         unit: '18L',     unitPrice: 280 },
    },
  },
  GB: {
    name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', locale: 'en-GB', symbol: '£',
    baseCostPerSqm: 2200,
    materials: {
      cement:  { name: 'Cement',       unit: 'Bags',    unitPrice: 12 },
      blocks:  { name: 'Bricks',        unit: '1000',    unitPrice: 700 },
      iron:    { name: 'Steel Rebar',  unit: 'Tons',    unitPrice: 900 },
      sand:    { name: 'Sharp Sand',   unit: 'Tonnes',  unitPrice: 50 },
      granite: { name: 'Aggregates',   unit: 'Tonnes',  unitPrice: 65 },
      roofing: { name: 'Roofing Felt', unit: 'sqm',     unitPrice: 28 },
      tiles:   { name: 'Tiles',        unit: 'sqm',     unitPrice: 45 },
      paint:   { name: 'Paint',        unit: '10L',     unitPrice: 65 },
    },
  },
  US: {
    name: 'United States', flag: '🇺🇸', currency: 'USD', locale: 'en-US', symbol: '$',
    baseCostPerSqm: 1800,
    materials: {
      cement:  { name: 'Concrete Mix', unit: 'Bags',    unitPrice: 14 },
      blocks:  { name: 'CMU Blocks',   unit: 'Units',   unitPrice: 3.8 },
      iron:    { name: 'Rebar Steel',  unit: 'Tons',    unitPrice: 850 },
      sand:    { name: 'Masonry Sand', unit: 'Tonnes',  unitPrice: 45 },
      granite: { name: 'Crushed Stone',unit: 'Tonnes',  unitPrice: 55 },
      roofing: { name: 'Asphalt Shingle',unit:'sqm',    unitPrice: 35 },
      tiles:   { name: 'Tile',         unit: 'sqm',     unitPrice: 55 },
      paint:   { name: 'Paint',        unit: 'Gallon',  unitPrice: 50 },
    },
  },
  CA: {
    name: 'Canada', flag: '🇨🇦', currency: 'CAD', locale: 'en-CA', symbol: 'CA$',
    baseCostPerSqm: 2400,
    materials: {
      cement:  { name: 'Concrete',     unit: 'Bags',    unitPrice: 18 },
      blocks:  { name: 'CMU Blocks',   unit: 'Units',   unitPrice: 5 },
      iron:    { name: 'Rebar',        unit: 'Tons',    unitPrice: 1100 },
      sand:    { name: 'Sand',         unit: 'Tonnes',  unitPrice: 55 },
      granite: { name: 'Gravel',       unit: 'Tonnes',  unitPrice: 68 },
      roofing: { name: 'Shingles',     unit: 'sqm',     unitPrice: 42 },
      tiles:   { name: 'Tiles',        unit: 'sqm',     unitPrice: 65 },
      paint:   { name: 'Paint',        unit: 'Gallon',  unitPrice: 60 },
    },
  },
  IN: {
    name: 'India', flag: '🇮🇳', currency: 'INR', locale: 'en-IN', symbol: '₹',
    baseCostPerSqm: 42000,
    materials: {
      cement:  { name: 'Cement',       unit: 'Bags',    unitPrice: 400 },
      blocks:  { name: 'Bricks',       unit: '1000',    unitPrice: 8000 },
      iron:    { name: 'TMT Steel',    unit: 'Tons',    unitPrice: 65000 },
      sand:    { name: 'River Sand',   unit: 'Cubic Ft',unitPrice: 1800 },
      granite: { name: 'Granite Stone',unit: 'Cubic Ft',unitPrice: 2200 },
      roofing: { name: 'Roofing Sheet',unit: 'sqm',     unitPrice: 900 },
      tiles:   { name: 'Vitrified Tile',unit:'sqm',     unitPrice: 550 },
      paint:   { name: 'Paint',        unit: 'Litre',   unitPrice: 300 },
    },
  },
  AU: {
    name: 'Australia', flag: '🇦🇺', currency: 'AUD', locale: 'en-AU', symbol: 'A$',
    baseCostPerSqm: 2800,
    materials: {
      cement:  { name: 'Cement',       unit: 'Bags',    unitPrice: 18 },
      blocks:  { name: 'Besser Blocks',unit: 'Units',   unitPrice: 6 },
      iron:    { name: 'Structural Steel',unit:'Tons',  unitPrice: 1400 },
      sand:    { name: 'Sand',         unit: 'Tonnes',  unitPrice: 65 },
      granite: { name: 'Aggregates',   unit: 'Tonnes',  unitPrice: 80 },
      roofing: { name: 'Colorbond',    unit: 'sqm',     unitPrice: 55 },
      tiles:   { name: 'Tiles',        unit: 'sqm',     unitPrice: 75 },
      paint:   { name: 'Paint',        unit: '4L',      unitPrice: 80 },
    },
  },
};

export const FINISH_LEVELS = { basic: 0.75, standard: 1.0, luxury: 1.55 };

export const PROJECT_TYPES = [
  { id: 'bungalow',    label: 'Bungalow',         icon: '🏠', desc: 'Single-story residential structure' },
  { id: 'duplex',      label: 'Duplex',            icon: '🏡', desc: 'Multi-level residential building' },
  { id: 'apartment',  label: 'Apartment Block',   icon: '🏢', desc: 'Multi-unit residential complex' },
  { id: 'commercial', label: 'Commercial Plaza',  icon: '🏬', desc: 'Retail or office development' },
  { id: 'warehouse',  label: 'Warehouse',         icon: '🏭', desc: 'Industrial storage facility' },
  { id: 'school',     label: 'School / Church',   icon: '🏫', desc: 'Educational or religious building' },
  { id: 'hospital',   label: 'Hospital / Clinic', icon: '🏥', desc: 'Medical facility structure' },
];

export function formatCurrency(amount: number, countryCode: string): string {
  const c = COUNTRIES[countryCode] || COUNTRIES['NG'];
  try {
    return new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${c.symbol}${amount.toLocaleString()}`;
  }
}

export function calculateMaterials(sqm: number, finish: keyof typeof FINISH_LEVELS = 'standard', countryCode = 'NG') {
  const multiplier = FINISH_LEVELS[finish];
  const country = COUNTRIES[countryCode] || COUNTRIES['NG'];
  const prices = country.materials;

  const quantities: Record<MaterialKey, number> = {
    cement:  sqm * 3.2 * multiplier,
    blocks:  sqm * 50 * multiplier,
    iron:    sqm * 0.022 * multiplier,
    sand:    sqm * 0.05 * multiplier,
    granite: sqm * 0.04 * multiplier,
    roofing: sqm * 0.9 * multiplier,
    tiles:   sqm * 1.2 * multiplier,
    paint:   sqm * 0.2 * multiplier,
  };

  const breakdown: Record<string, MaterialData> = {};
  let grandTotal = 0;

  (Object.keys(prices) as MaterialKey[]).forEach((key) => {
    const info = prices[key];
    const qty = Math.ceil(quantities[key] * 100) / 100;
    const total = qty * info.unitPrice;
    breakdown[key] = { name: info.name, quantity: qty, unit: info.unit, unitPrice: info.unitPrice, total };
    grandTotal += total;
  });

  return { breakdown, grandTotal, sqm, finish, countryCode, currency: country.currency, locale: country.locale, symbol: country.symbol };
}
