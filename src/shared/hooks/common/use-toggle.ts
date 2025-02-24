import { useCallback, useState } from 'react';

export function useToggle(initialState: boolean = false) {
  const [open, setOpen] = useState(initialState);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  return [open, toggle] as const;
}
