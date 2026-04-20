export interface SavedEstimate {
  id: string;
  userEmail: string;
  title: string;
  type: string;
  sqm: number;
  finish: string;
  location: string;
  total: number;
  breakdown: Record<string, { name: string; quantity: number; unit: string; unitPrice: number; total: number }>;
  aiInsights: { smartTip: string; buildingGuide: string } | null;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = 'sezapro_estimates';

export function getAllEstimates(): SavedEstimate[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getEstimatesForUser(email: string): SavedEstimate[] {
  return getAllEstimates().filter(e => e.userEmail === email);
}

export function saveEstimate(estimate: Omit<SavedEstimate, 'id' | 'timestamp' | 'date'>): SavedEstimate {
  const all = getAllEstimates();
  const newEstimate: SavedEstimate = {
    ...estimate,
    id: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: Date.now(),
    date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newEstimate, ...all]));
  return newEstimate;
}

export function deleteEstimate(id: string): void {
  const all = getAllEstimates().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
