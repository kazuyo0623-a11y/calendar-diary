import React from 'react';
import { MOODS } from '../types';
import type { MoodType } from '../types';

interface Props {
  value: MoodType | null;
  onChange: (mood: MoodType | null) => void;
}

export const MoodSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        今日の気分
      </label>
      <div className="flex gap-2 flex-wrap">
        {(Object.entries(MOODS) as [MoodType, typeof MOODS[MoodType]][]).map(([key, mood]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(value === key ? null : key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium
              transition-all duration-150
              ${value === key
                ? mood.color + ' ring-2 ring-offset-1 ring-purple-400 shadow-sm'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}
            `}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
