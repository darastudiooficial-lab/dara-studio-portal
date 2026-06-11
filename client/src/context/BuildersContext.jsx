import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── localStorage helpers ───────────────────────────────────────────────────────
const STORAGE_KEY = 'dara_builders_store';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function persistStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded – silently ignore */ }
}

// ─── Helper: generate simple unique id ──────────────────────────────────────────
let _idCounter = Date.now();
const uid = () => `bh_${_idCounter++}`;

// ─── Default / Seed Data ────────────────────────────────────────────────────────
// Interior Reference defaults
const DEFAULT_INTERIOR_CATEGORIES = [
  { id: 'cabinetry', label: `Cabinetry & Joinery`, labelPt: 'Marcenaria & Gabinetes', icon: '🪵', sort: 0 },
  { id: 'moldings', label: `Moldings & Trim`, labelPt: 'Molduras & Acabamentos', icon: '📐', sort: 1 },
  { id: 'countertops', label: `Surfaces & Countertops`, labelPt: 'Bancadas & Revestimentos', icon: '💎', sort: 2 },
  { id: 'doors', label: `Doors & Entryways`, labelPt: `Portas & Vãos`, icon: '🚪', sort: 3 },
  { id: 'lighting', label: `Lighting & Clearance`, labelPt: `Iluminação & Alturas`, icon: '💡', sort: 4 },
];

// Code Inspector static filters (not user-editable, but exported for reference)
export const INSPECTOR_PROJECTS = [
  { id: "new_con", label: `New Construction`, icon: "🏠" },
  { id: "addition", label: `Addition / Expansion`, icon: "➕" },
  { id: "remodel", label: `Interior Remodel`, icon: "🔨" },
  { id: "interiors", label: `Interior Design`, icon: "🎨" },
  { id: "deck_roof", label: `Deck (With Roof)`, icon: "🏗" },
  { id: "deck_open", label: `Deck (Open)`, icon: "🪵" },
  { id: "porch_enc", label: `Porch (Enclosed)`, icon: "🏛" },
  { id: "porch_open", label: `Porch (Open)`, icon: "🌿" },
  { id: "adu", label: `ADU / In-Law Suite`, icon: "🏘" },
  { id: "basement", label: `Finished Basement`, icon: "🔲" },
  { id: "dormer", label: `Dormer / Attic`, icon: "🏚" },
  { id: "garage", label: `Garage (Det/Att)`, icon: "🚗" },
];

export const INSPECTOR_SYSTEMS = [
  { id: "roof_types", label: `Roof Types & Styles` },
  { id: "roof_conn", label: `Roof Connections` },
  { id: "foundation", label: `Foundation / Footings` },
  { id: "framing", label: `Framing & Structure` },
  { id: "thermal", label: `Thermal / Insulation` },
  { id: "envelope", label: `Wall Assembly` },
  { id: "mep", label: `MEP Systems` },
  { id: "fire", label: `Life Safety / Fire` },
];

// ─── Context ────────────────────────────────────────────────────────────────────
const BuildersContext = createContext(null);

export function BuildersProvider({ children }) {
  // Initialise from localStorage or seed defaults
  const [store, setStore] = useState(() => {
    const saved = loadStore();
    if (saved && saved._version === 1) return saved;
    // First load – seed with defaults
    return {
      _version: 1,
      interiorCategories: DEFAULT_INTERIOR_CATEGORIES,
      interiorItems: [],       // will be seeded by InteriorReference on first mount
      inspectorNotes: [],      // will be seeded by CodeInspector on first mount
      fieldguideQuick: [],     // will be seeded by FieldGuide on first mount
      fieldguideRules: [],
      fieldguideChecklist: [],
      fieldguideCad: [],
    };
  });

  // Persist whenever store changes
  useEffect(() => {
    persistStore(store);
  }, [store]);

  // ─── Generic CRUD ───────────────────────────────────────────────────────────
  const getCollection = useCallback((key) => store[key] || [], [store]);

  const seedCollection = useCallback((key, data) => {
    setStore(prev => {
      // Only seed if the collection is empty (first time)
      if (prev[key] && prev[key].length > 0) return prev;
      return { ...prev, [key]: data };
    });
  }, []);

  const addEntry = useCallback((key, entry) => {
    const newEntry = { ...entry, id: entry.id || uid(), _createdAt: new Date().toISOString() };
    setStore(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newEntry],
    }));
    return newEntry.id;
  }, []);

  const updateEntry = useCallback((key, id, updates) => {
    setStore(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(item =>
        item.id === id ? { ...item, ...updates, _updatedAt: new Date().toISOString() } : item
      ),
    }));
  }, []);

  const deleteEntry = useCallback((key, id) => {
    setStore(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(item => item.id !== id),
    }));
  }, []);

  const reorderEntry = useCallback((key, id, direction) => {
    setStore(prev => {
      const arr = [...(prev[key] || [])];
      const idx = arr.findIndex(item => item.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return { ...prev, [key]: arr };
    });
  }, []);

  // ─── Convenience: reset a collection to empty (forces re-seed on next mount)
  const resetCollection = useCallback((key) => {
    setStore(prev => ({ ...prev, [key]: [] }));
  }, []);

  const value = {
    getCollection,
    seedCollection,
    addEntry,
    updateEntry,
    deleteEntry,
    reorderEntry,
    resetCollection,
    // Expose static filter lists for inspector
    INSPECTOR_PROJECTS,
    INSPECTOR_SYSTEMS,
  };

  return (
    <BuildersContext.Provider value={value}>
      {children}
    </BuildersContext.Provider>
  );
}

export function useBuilders() {
  const ctx = useContext(BuildersContext);
  if (!ctx) throw new Error('useBuilders must be used inside <BuildersProvider>');
  return ctx;
}

export default BuildersContext;
