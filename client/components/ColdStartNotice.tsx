'use client';
import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return sessionStorage.getItem('coldStartNoticeSeen') !== 'true';
}

function getServerSnapshot() {
  return false; // always hidden during SSR
}

function dismiss() {
  sessionStorage.setItem('coldStartNoticeSeen', 'true');
  listeners.forEach((l) => l());
}

export default function ColdStartNotice() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-white border border-[var(--color-stone-line)] shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 bg-[var(--color-brass)]/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--color-brass)]">
            <path
              d="M8 5.5V8.5M8 11H8.008M14.5 8A6.5 6.5 0 111.5 8a6.5 6.5 0 0113 0z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-ink)] mb-1">
            Heads up: free-tier hosting
          </p>
          <p className="text-xs text-[var(--color-ink)]/60 leading-relaxed">
            This project runs on Railway&apos;s free plan, so the backend can spin
            down after inactivity. If something doesn&apos;t load right away, wait
            5-8 seconds and try again. It just needs a moment to wake up.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}