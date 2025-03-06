import { RefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useKeepAliveScrollHistoryRef<T extends HTMLElement>(domRef?: RefObject<T | null>) {
  const location = useLocation();
  const scrollHistoryMap = useRef<Map<string, number>>(new Map());

  const activeKey = location.pathname + location.search;

  useEffect(() => {
    const divDom = domRef?.current;
    if (!divDom) return;
    setTimeout(() => {
      divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
    }, 0); // 300 milliseconds to wait for the animation transition ending
    const onScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (!target) return;
      scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
    };
    divDom?.addEventListener('scroll', onScroll, {
      passive: true,
    });
    return () => {
      divDom?.removeEventListener('scroll', onScroll);
    };
  }, [activeKey]);

  return domRef;
}
