import React, { useState, useEffect, useRef } from 'react';
import type { DiaryEntry, MoodType } from '../types';
import { MoodSelector } from './MoodSelector';
import { TagInput } from './TagInput';

interface Props {
  date: string;
  entry: DiaryEntry | null;
  onSave: (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function formatDateJP(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${y}年${m}月${d}日（${weekdays[date.getDay()]}）`;
}

// key={date} で呼び出し元からリマウントさせることで、日付切替時に状態をリセットする
export const DiaryEditor: React.FC<Props> = ({ date, entry, onSave, onDelete, onCancel }) => {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [mood, setMood] = useState<MoodType | null>(entry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // タイマーをアンマウント時にクリア（メモリリーク防止）
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;
    onSave({ date, title, content, mood, tags });
  };

  const handleDelete = () => {
    if (isDeleting) {
      onDelete();
    } else {
      setIsDeleting(true);
      deleteTimerRef.current = setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
      {/* Date header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{formatDateJP(date)}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="閉じる"
        >
          ✕
        </button>
      </div>

      {/* Mood */}
      <MoodSelector value={mood} onChange={setMood} />

      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル（省略可）"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今日のできごとを書きましょう…"
          className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all resize-none leading-relaxed"
          style={{ minHeight: '160px' }}
        />
      </div>

      {/* Tags */}
      <TagInput tags={tags} onChange={setTags} />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={!content.trim() && !title.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
        >
          保存
        </button>
        {entry && (
          <button
            type="button"
            onClick={handleDelete}
            className={`px-4 py-2.5 rounded-xl font-medium transition-colors ${
              isDeleting
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            {isDeleting ? '本当に削除？' : '削除'}
          </button>
        )}
      </div>
    </form>
  );
};
