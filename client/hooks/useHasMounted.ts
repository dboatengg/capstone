'use client';

// Prevents hydration mismatch by detecting client-side mount
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// Returns true after client mount, false during server render
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client: mounted
    () => false // server: never mounted
  );
}