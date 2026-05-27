import React from 'react';
import { MOODS } from '../types';
import type { DiaryEntry } from '../types';

interface Props {
  entry: DiaryEntry;
  onClick: () => void;
}

function formatDateJP(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${y}年${m}月${d}日（${weekdays[date.getDay()]}）`;
}

export const DiaryCard: React.FC<Props> = ({ entry, onClick }) => {
  const moodInfo = entry.mood ? MOODS[entry.mood] : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 hover:border-purple-200 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">{formatDateJP(entry.date)}</span>
          {moodInfo && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${moodInfo.color}`}>
              {moodInfo.emoji} {moodInfo.label}
            </span>
          )}
        </div>
      </div>

      {entry.title && (
        <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
          {entry.title}
        </h3>
      )}

      {entry.content && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {entry.content}
        </p>
      )}

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};
