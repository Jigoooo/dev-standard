import type { JSX, RefObject } from 'react';
import { useRef } from 'react';

function shallowEqual<T>(objA: T, objB: T): boolean {
  if (objA === objB) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if ((objA as any)[key] !== (objB as any)[key]) return false;
  }
  return true;
}

/**
 * useCellCache
 *
 * @param key - 각 행을 고유하게 식별할 수 있는 키 (예: row.index)
 * @param data - 행의 데이터 (불변 객체를 권장)
 * @param renderFn - 해당 행을 렌더링하는 함수
 * @param externalCacheRef - 외부에서 관리할 cacheRef (옵션)
 * @returns 캐싱된 JSX.Element
 */
export function useCellCache<T>(
  key: string,
  data: T,
  renderFn: () => JSX.Element,
  externalCacheRef?: RefObject<Map<string, { data: T; element: JSX.Element }>>,
): JSX.Element {
  // 외부에서 cacheRef를 전달하지 않으면 내부에서 생성
  const internalCacheRef = useRef<Map<string, { data: T; element: JSX.Element }>>(new Map());
  const cacheRef = externalCacheRef || internalCacheRef;

  if (cacheRef.current.has(key)) {
    const cached = cacheRef.current.get(key)!;
    console.log('externalCacheRef: ', externalCacheRef);
    console.log('cached: ', cached);
    console.log('shallowEqual(cached.data, data): ', shallowEqual(cached.data, data));
    if (shallowEqual(cached.data, data)) {
      return cached.element;
    }
  }
  const element = renderFn();
  cacheRef.current.set(key, { data, element });
  return element;
}
