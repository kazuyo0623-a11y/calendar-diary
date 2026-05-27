import { useState, useMemo } from 'react';
import { useDiaries } from './hooks/useDiaries';
import { Calendar } from './components/Calendar';
import { DiaryEditor } from './components/DiaryEditor';
import { DiaryCard } from './components/DiaryCard';
import { SearchBar } from './components/SearchBar';
import type { DiaryEntry, MoodType } from './types';

type View = 'list' | 'editor';

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<View>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const { getByDate, getDatesWithEntries, entries, saveEntry, deleteEntry, searchEntries } = useDiaries();

  const datesWithEntries = getDatesWithEntries();

  // Map date → mood for calendar display
  const entryMoods = useMemo(() => {
    const map: Record<string, MoodType | null> = {};
    for (const e of entries) {
      map[e.date] = e.mood;
    }
    return map;
  }, [entries]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setView('editor');
    setSearchQuery('');
  };

  const handleSave = (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    saveEntry(data);
  };

  const handleDelete = () => {
    if (selectedDate) {
      deleteEntry(selectedDate);
      setSelectedDate(null);
      setView('list');
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setView('list');
  };

  const currentEntry = selectedDate ? getByDate(selectedDate) : null;
  const searchResults = searchQuery ? searchEntries(searchQuery) : null;

  // Entries for current month (sorted newest first), used in list view
  const monthEntries = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
    return entries
      .filter((e) => e.date.startsWith(prefix))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, year, month]);

  const displayedEntries = searchResults
    ? [...searchResults].sort((a, b) => b.date.localeCompare(a.date))
    : monthEntries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">📔</span>
            <h1 className="text-lg font-bold text-purple-700 tracking-tight">カレンダー日記</h1>
          </div>
          <div className="flex-1 max-w-md">
            <SearchBar value={searchQuery} onChange={(q) => {
              setSearchQuery(q);
              if (q) { setView('list'); setSelectedDate(null); }
            }} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">
          {/* Left: Calendar + stats */}
          <div className="w-72 shrink-0 space-y-4">
            <Calendar
              currentYear={year}
              currentMonth={month}
              selectedDate={selectedDate}
              datesWithEntries={datesWithEntries}
              entryMoods={entryMoods}
              onSelectDate={handleSelectDate}
              onChangeMonth={(y, m) => { setYear(y); setMonth(m); setSelectedDate(null); setView('list'); }}
            />

            {/* Stats card */}
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">統計</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">今月の日記</span>
                  <span className="font-bold text-purple-700">{monthEntries.length}件</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">合計</span>
                  <span className="font-bold text-purple-700">{entries.length}件</span>
                </div>
              </div>
            </div>

            {/* New entry button */}
            <button
              onClick={() => {
                const todayStr = new Date().toISOString().slice(0, 10);
                handleSelectDate(todayStr);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              <span>今日の日記を書く</span>
            </button>
          </div>

          {/* Right: Editor or list */}
          <div className="flex-1 min-w-0">
            {view === 'editor' && selectedDate ? (
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 min-h-[500px] flex flex-col">
                <DiaryEditor
                  key={selectedDate}
                  date={selectedDate}
                  entry={currentEntry}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onCancel={handleCancel}
                />
              </div>
            ) : (
              <div>
                {/* Section title */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-700">
                    {searchQuery
                      ? `「${searchQuery}」の検索結果 (${displayedEntries.length}件)`
                      : `${year}年${month + 1}月の日記`}
                  </h2>
                </div>

                {displayedEntries.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-gray-400 text-sm">
                      {searchQuery ? '検索結果がありません' : 'まだ日記がありません。カレンダーの日付をクリックして書き始めましょう！'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayedEntries.map((entry) => (
                      <DiaryCard
                        key={entry.id}
                        entry={entry}
                        onClick={() => handleSelectDate(entry.date)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
