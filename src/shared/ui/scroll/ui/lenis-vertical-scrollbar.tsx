import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useLocation } from 'react-router-dom';

import { zIndex } from '@/shared/constants';

export function LenisVerticalScrollbar({ disabled = false }: { disabled?: boolean }) {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (disabled) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [disabled]);

  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startScrollRef = useRef(0);

  const [visible, setVisible] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!lenis) return;

    setTimeout(() => {
      lenis.resize();
      // lenis.scrollTo(0, { lerp: 0.2 });
      lenis.scrollTo(0, { immediate: true });
    }, 100);
  }, [location.pathname, lenis]);

  useEffect(() => {
    if (disabled) {
      setVisible(false);
      setThumbHeight(0);
    }
  }, [disabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!lenis || disabled) return;

    const handleScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const containerHeight = window.innerHeight;
      const scrollHeight = limit + containerHeight;

      const heightRatio = containerHeight / scrollHeight;
      const thumbH = containerHeight * heightRatio;
      const thumbT = (scroll / limit) * (containerHeight - thumbH);

      setThumbTop(thumbT);
      setThumbHeight(Math.max(30, thumbH));

      setVisible(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setVisible(false), 1000);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [lenis, location.pathname, disabled]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startScrollRef.current = lenis?.scroll ?? 0;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isDragging || !lenis || disabled) return;

    const handleMove = (e: PointerEvent) => {
      const deltaY = e.clientY - startYRef.current;
      const containerHeight = window.innerHeight;
      const scrollbarMovable = containerHeight - thumbHeight;
      const scrollableHeight = lenis.limit;
      const scrollRatio = scrollableHeight / scrollbarMovable;
      const newScroll = startScrollRef.current + deltaY * scrollRatio;

      lenis.scrollTo(newScroll, { immediate: true });
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [disabled, isDragging, thumbHeight, lenis]);

  return (
    <div
      role='scrollbar'
      aria-label='페이지 스크롤바'
      aria-orientation='vertical'
      aria-hidden={disabled}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100svh',
        paddingBlock: 2,
        paddingRight: 2,
        paddingLeft: isHover ? 6 : 2,
        transition: 'all 0.3s ease',
        opacity: lenis && lenis.limit > 0 && visible ? 1 : 0,
        zIndex: zIndex.scrollbar,
      }}
      onMouseEnter={() => {
        if (lenis && lenis.limit > 0) {
          setVisible(true);
          setIsHover(true);
        }
      }}
      onMouseLeave={() => {
        if (!isDragging) setIsHover(false);
      }}
    >
      <motion.div
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        style={{
          position: 'relative',
          top: thumbTop || 0,
          right: 0,
          width: isHover ? 8 : 4,
          height: thumbHeight,
          borderRadius: 4,
          cursor: lenis && lenis.limit > 0 ? 'pointer' : 'default',
          zIndex: 9999,
          transition: 'width 0.3s ease',
        }}
        initial={{ backgroundColor: '#555555' }}
        animate={{ backgroundColor: isDragging ? '#1e84f1' : '#555555' }}
      />
    </div>
  );
}
