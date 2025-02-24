import { DependencyList, useEffect, useRef } from 'react';

/**
 * 첫 렌더링 시 useEffect 막음
 * @param func
 * @param deps
 */
export function useDidMountEffect(func: () => void, deps: DependencyList | undefined) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}
