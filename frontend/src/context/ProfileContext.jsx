import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PROGRAMS } from '../data/programs.js';
import { evaluateAll, pct } from '../lib/merit.js';

const DEFAULTS = {
  stage: 'part1',
  group: 'ICS',
  matricPct: 91.2,
  interObtained: 462,
  interTotal: 520,
  testMode: 'assumed', // 'assumed' | 'taken'
  testName: 'FAST NU Test',
  testScore: 76,
  maxFee: 120000,
  hostel: false,
  scholarships: false,
};

const KEY = 'meritsphere-profile';
const Ctx = createContext(null);
export const useProfile = () => useContext(Ctx);

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return DEFAULTS;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(load);
  const [compare, setCompare] = useState([]);
  const [selectedId, setSelectedId] = useState('fast-cs');

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch { /* ignore */ }
  }, [profile]);

  const setField = useCallback((k, v) => setProfile((p) => ({ ...p, [k]: v })), []);
  const reset = useCallback(() => setProfile(DEFAULTS), []);

  const derived = useMemo(() => {
    const interRaw = pct(profile.interObtained, profile.interTotal);
    const errors = {};
    if (profile.interTotal <= 0) errors.inter = 'Total marks must be greater than 0.';
    else if (profile.interObtained > profile.interTotal) errors.inter = 'Obtained marks cannot be more than total marks.';
    else if (profile.interObtained < 0) errors.inter = 'Marks cannot be negative.';
    if (profile.matricPct < 0 || profile.matricPct > 100) errors.matric = 'Enter a percentage between 0 and 100.';
    return {
      interPct: Math.min(100, Math.max(0, interRaw)),
      matricPct: Math.min(100, Math.max(0, profile.matricPct)),
      testPct: Math.min(100, Math.max(0, profile.testScore)),
      group: profile.group,
      maxFee: profile.maxFee,
      errors,
      valid: Object.keys(errors).length === 0,
    };
  }, [profile]);

  const results = useMemo(() => evaluateAll(PROGRAMS, derived), [derived]);

  const toggleCompare = useCallback((id) => {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 5 ? c : [...c, id]));
  }, []);
  const clearCompare = useCallback(() => setCompare([]), []);

  const value = {
    profile, setField, reset, derived, results,
    compare, toggleCompare, clearCompare,
    selectedId, setSelectedId,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
