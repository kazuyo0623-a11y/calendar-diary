import React from 'react';
import { MOODS } from '../types';
import type { MoodType } from '../types';

interface Props {
  currentYear: number;
  currentMonth: number; // 0-indexed
  selectedDate: string | null;
  datesWithEntries: Set<string>;
  entryMoods: Record<string, MoodType | null>;
  onSelectDate: (date: string) => void;
  onChangeMonth: (year: number, month: number) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const Calendar: React.FC<Props> = ({
  currentYear,
  currentMonth,
  selectedDate,
  datesWithEntries,
  entryMoods,
  onSelectDate,
  onChangeMonth,
}) => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const prevMonth = () => {
    if (currentMonth === 0) onChangeMonth(currentYear - 1, 11);
    else onChangeMonth(currentYear, currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) onChangeMonth(currentYear + 1, 0);
    else onChangeMonth(currentYear, currentMonth + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-50 text-purple-600 transition-colors"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold text-gray-800">
          {currentYear}年 {currentMonth + 1}月
        </h2>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-50 text-purple-600 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const dateStr = toDateStr(currentYear, currentMonth, day);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasEntry = datesWithEntries.has(dateStr);
          const mood = entryMoods[dateStr];
          const weekday = (firstDay + day - 1) % 7;

          let moodDot: string | null = null;
          if (hasEntry && mood && MOODS[mood]) {
            moodDot = MOODS[mood].emoji;
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative flex flex-col items-center justify-center aspect-square rounded-xl text-sm font-medium
                transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'bg-purple-600 text-white shadow-md'
                  : isToday
                  ? 'bg-purple-50 text-purple-700 ring-2 ring-purple-300'
                  : hasEntry
                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'text-gray-700 hover:bg-gray-50'}
                ${weekday === 0 ? 'text-red-400' : ''}
                ${weekday === 6 ? 'text-blue-400' : ''}
                ${isSelected ? '!text-white' : ''}
              `}
            >
              <span className="leading-none">{day}</span>
              {moodDot && (
                <span className="text-xs leading-none mt-0.5">{moodDot}</span>
              )}
              {hasEntry && !moodDot && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-purple-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
