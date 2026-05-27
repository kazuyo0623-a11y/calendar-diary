export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const MOODS: Record<MoodType, { emoji: string; label: string; color: string }> = {
  great:    { emoji: '😄', label: '最高',   color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  good:     { emoji: '😊', label: 'いい感じ', color: 'bg-green-100 text-green-700 border-green-300' },
  neutral:  { emoji: '😐', label: 'ふつう',  color: 'bg-gray-100 text-gray-600 border-gray-300' },
  bad:      { emoji: '😔', label: 'つらい',  color: 'bg-blue-100 text-blue-700 border-blue-300' },
  terrible: { emoji: '😢', label: 'ひどい',  color: 'bg-red-100 text-red-700 border-red-300' },
};
