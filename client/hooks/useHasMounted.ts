'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client: mounted
    () => false // server: never mounted
  );
}