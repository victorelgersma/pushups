export interface Tally {
  id: string;
  name: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'tall-e-tallies';

/**
 * Gets all tallies from localStorage
 */
export const getTallies = (): Tally[] => {
  if (typeof window === 'undefined') return [];
  
  const talliesJson = localStorage.getItem(STORAGE_KEY);
  if (!talliesJson) return [];
  
  try {
    return JSON.parse(talliesJson);
  } catch (error) {
    console.error('Failed to parse tallies from localStorage:', error);
    return [];
  }
};

/**
 * Saves tallies to localStorage
 */
export const saveTallies = (tallies: Tally[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tallies));
};

/**
 * Adds a new tally
 */
export const addTally = (name: string): Tally => {
  const tallies = getTallies();
  const now = new Date().toISOString();
  
  const newTally: Tally = {
    id: crypto.randomUUID(),
    name,
    count: 0,
    createdAt: now,
    updatedAt: now,
  };
  
  tallies.push(newTally);
  saveTallies(tallies);
  return newTally;
};

/**
 * Updates a tally's count
 */
export const updateTallyCount = (id: string, count: number): Tally | null => {
  const tallies = getTallies();
  const tallyIndex = tallies.findIndex(tally => tally.id === id);
  
  if (tallyIndex === -1) return null;
  
  tallies[tallyIndex] = {
    ...tallies[tallyIndex],
    count,
    updatedAt: new Date().toISOString(),
  };
  
  saveTallies(tallies);
  return tallies[tallyIndex];
};

/**
 * Removes a tally
 */
export const removeTally = (id: string): void => {
  const tallies = getTallies();
  const filteredTallies = tallies.filter(tally => tally.id !== id);
  saveTallies(filteredTallies);
};

/**
 * Resets a tally's count to zero
 */
export const resetTally = (id: string): Tally | null => {
  return updateTallyCount(id, 0);
};