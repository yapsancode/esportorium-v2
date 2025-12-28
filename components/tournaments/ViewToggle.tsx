// ============================================================================
// FILE: components/tournaments/ViewToggle.tsx
// ============================================================================
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex bg-white border border-slate-200 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'
        }`}
        aria-label="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}