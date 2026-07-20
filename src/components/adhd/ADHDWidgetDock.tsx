import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useUIStore } from '../../store';
import { cn } from '../../utils';

// Placeholder widget components (to be replaced with actual implementations later)
const EnergyGauge: React.FC = () => (
  <div className="bg-slate-800/50 p-3 rounded-lg h-full flex items-center justify-center text-xs text-slate-400">
    Energy
  </div>
);

const FocusTimer: React.FC = () => (
  <div className="bg-slate-800/50 p-3 rounded-lg h-full flex items-center justify-center text-xs text-slate-400">
    Focus
  </div>
);

const MicroHabitStack: React.FC = () => (
  <div className="bg-slate-800/50 p-3 rounded-lg h-full flex items-center justify-center text-xs text-slate-400">
    Habits
  </div>
);

const QuickCapture: React.FC = () => (
  <div className="bg-slate-800/50 p-3 rounded-lg h-full flex items-center justify-center text-xs text-slate-400">
    Capture
  </div>
);

const TaskBatcher: React.FC = () => (
  <div className="bg-slate-800/50 p-4 rounded-lg w-full max-w-xs mx-auto space-y-2">
    <div className="font-medium text-white">Task Batcher</div>
    <div className="text-sm text-slate-400">Batch similar tasks</div>
  </div>
);

const MedicationTracker: React.FC = () => (
  <div className="bg-slate-800/50 p-4 rounded-lg w-full max-w-xs mx-auto space-y-2">
    <div className="font-medium text-white">Meds</div>
    <div className="text-sm text-slate-400">Track medication</div>
  </div>
);

const ReflectionPrompt: React.FC = () => (
  <div className="bg-slate-800/50 p-4 rounded-lg w-full max-w-xs mx-auto space-y-2">
    <div className="font-medium text-white">Reflection</div>
    <div className="text-sm text-slate-400">End-of-day reflection</div>
  </div>
);

const WeeklyReview: React.FC = () => (
  <div className="bg-slate-800/50 p-4 rounded-lg w-full max-w-xs mx-auto space-y-2">
    <div className="font-medium text-white">Weekly</div>
    <div className="text-sm text-slate-400">Weekly review</div>
  </div>
);

// Map widget IDs to components
const WidgetMap: Record<string, React.FC> = {
  energy: EnergyGauge,
  focus: FocusTimer,
  microhabit: MicroHabitStack,
  quickcapture: QuickCapture,
  taskbatcher: TaskBatcher,
  medication: MedicationTracker,
  reflection: ReflectionPrompt,
  weeklyreview: WeeklyReview,
};

interface DockProps {}
export function ADHDWidgetDock(): JSX.Element {
  const { isFocusMode } = useUIStore();
  const [a1Order, setA1Order] = useState<string[]>(['energy', 'focus', 'microhabit', 'quickcapture']);
  const [c1Order, setC1Order] = useState<string[]>(['taskbatcher', 'medication', 'reflection', 'weeklyreview']);
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<{ id: string; index: number; row: 'a1' | 'c1' } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1);
  const a1Ref = useRef<HTMLDivElement>(null);
  const c1Ref = useRef<HTMLDivElement>(null);

  // Load persisted order and expanded state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adhdDockState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.a1Order)) setA1Order(parsed.a1Order);
        if (Array.isArray(parsed.c1Order)) setC1Order(parsed.c1Order);
        if (typeof expandedWidget === 'string' || expandedWidget === null)
          setExpandedWidget(parsed.expandedWidget ?? null);
      }
    } catch (e) {
      console.warn('Failed to load dock state', e);
    }
  }, []);

  // Save state to localStorage and emit custom event for Obsidian sync
  const saveState = useCallback(() => {
    const state = {
      a1Order,
      c1Order,
      expandedWidget,
    };
    try {
      localStorage.setItem('adhdDockState', JSON.stringify(state));
      // Dispatch custom event for Obsidian plugin
      window.dispatchEvent(
        new CustomEvent('adhd-dock:sync', {
          detail: state,
        })
      );
    } catch (e) {
      console.warn('Failed to save dock state', e);
    }
  }, [a1Order, c1Order, expandedWidget]);

  // Save whenever relevant state changes
  useEffect(() => {
    saveState();
  }, [a1Order, c1Order, expandedWidget, saveState]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, id: string, index: number, row: 'a1' | 'c1') => {
    setDragItem({ id, index, row });
    // For HTML5 drag and drop, we need to set data
    e.dataTransfer.setData('text/plain', id);
    // Add a class for visual feedback
    e.currentTarget.classList.add('dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault(); // Required to allow drop
    if (!dragItem) return;
    setDragOverIndex(index);
  }, [dragItem]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(-1);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!dragItem) return;
    setDragOverIndex(-1);

    const { id, index: oldIndex, row } = dragItem;
    if (row === 'a1') {
      setA1Order((prev) => {
        const newOrder = [...prev];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(index, 0, moved);
        return newOrder;
      });
    } else if (row === 'c1') {
      setC1Order((prev) => {
        const newOrder = [...prev];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(index, 0, moved);
        return newOrder;
      });
    }

    setDragItem(null);
  }, [dragItem]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDragItem(null);
    setDragOverIndex(-1);
  }, []);

  // Click to expand/collapse C1 widget
  const handleA1Click = useCallback((widgetId: string) => {
    setExpandedWidget((prev) => (prev === widgetId ? null : widgetId));
  }, []);

  // Handle escape key to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedWidget !== null) {
        setExpandedWidget(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedWidget]);

  if (isFocusMode) return null;

  return (
    <div
      id="adhd-dock"
      className="fixed left-0 right-top z-50 flex flex-col"
      style={{ top: 0 }}
      aria-label="ADHD Productivity Dock"
    >
      {/* A1 Row: Always visible */}
      <div
        ref={a1Ref}
        className="flex h-[48px] bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50"
        onDragOver={(e) => handleDragOver(e, -1)} // Prevent default for whole row
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, -1)} // We'll handle per-item
      >
        {a1Order.map((id, index) => {
          const Widget = WidgetMap[id] || EnergyGauge; // fallback
          const isDragging = dragItem?.id === id && dragItem?.row === 'a1';
          return (
            <div
              key={id}
              id={`a1-${id}`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, id, index, 'a1')}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => handleA1Click(id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer',
                isDragging && 'opacity-50 scale-95',
                expandedWidget === id && 'border-t-2 border-blue-500'
              )}
              role="button"
              tabindex={0}
              aria-label={`A1 widget: ${id}`}
            >
              <Widget />
              <div className="text-xs text-slate-400 capitalize">{id}</div>
            </div>
          );
        })}
      </div>

      {/* C1 Row: Expandable accordion */}
      <div
        ref={c1Ref}
        className={cn(
          'overflow-hidden',
          expandedWidget !== null && 'height-[320px]',
          expandedWidget === null && 'height-0'
        )}
        transition-property="height"
        transition-duration="200ms"
        transition-timing-function="ease-out"
      >
        {expandedWidget !== null && (
          <div className="flex flex-col gap-2 p-4 bg-slate-900/70 backdrop-blur-sm">
            {c1Order.map((id, index) => {
              const Widget = WidgetMap[id] || EnergyGauge;
              const isExpanded = expandedWidget === id;
              const isDragging = dragItem?.id === id && dragItem?.row === 'c1';
              return (
                <div
                  key={id}
                  id={`c1-${id}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, id, index, 'c1')}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    // If clicking the same widget, toggle collapse? We'll just keep it open on click.
                    // Could implement toggle, but spec says expand on hover/focus, so we keep as is.
                  }}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-lg',
                    isDragging && 'opacity-50 scale-95',
                    isExpanded && 'border-l-4 border-blue-500'
                  )}
                  role="button"
                  tabindex={0}
                  aria-label={`C1 widget: ${id}`}
                >
                  <Widget />
                  <div className="text-xs text-slate-400 capitalize">{id}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}