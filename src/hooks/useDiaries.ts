import { useState, useEffect, useCallback } from 'react';
import type { DiaryEntry } from '../types';

const STORAGE_KEY = 'calendar-diary-entries';

function loadFromStorage(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: DiaryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useDiaries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(entries);
  }, [entries]);

  const getByDate = useCallback((date: string) => {
    return entries.find((e) => e.date === date) ?? null;
  }, [entries]);

  const getDatesWithEntries = useCallback(() => {
    return new Set(entries.map((e) => e.date));
  }, [entries]);

  const saveEntry = useCallback((data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setEntries((prev) => {
      const existing = prev.find((e) => e.date === data.date);
      if (existing) {
        return prev.map((e) =>
          e.date === data.date
            ? { ...e, ...data, id: e.id, createdAt: e.createdAt, updatedAt: now }
            : e
        );
      } else {
        const newEntry: DiaryEntry = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        return [...prev, newEntry];
      }
    });
  }, []);

  const deleteEntry = useCallback((date: string) => {
    setEntries((prev) => prev.filter((e) => e.date !== date));
  }, []);

  const searchEntries = useCallback((query: string): DiaryEntry[] => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [entries]);

  return {
    entries,
    getByDate,
    getDatesWithEntries,
    saveEntry,
    deleteEntry,
    searchEntries,
  };
}
