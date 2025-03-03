import { RefObject, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';

type CustomVerticalScrollbarProps = {
  ref: RefObject<HTMLDivElement | null>;
  isTimeoutHiding?: boolean;
  totalContentHeight: number;
  border?: string;
  backgroundColor?: string;
};

export function CustomVerticalScrollbar({
  ref,
  isTimeoutHiding = false,
  totalContentHeight,
  border = '1px solid #bdc3c7',
  backgroundColor = '#f1f1f1',
}: CustomVerticalScrollbarProps) {
  const { scrollYProgress } = useScroll({ container: ref });

  const [containerHeight, setContainerHeight] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref.current) {
      setContainerHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  useEffect(() => {
    if (!isTimeoutHiding) {
      setShowScrollbar(true);
      return;
    }

    const container = ref.current;
    if (!container) return;

    const handleScroll = () => {
      // 컨테이너의 스크롤 이벤트가 발생하면 스크롤바를 보임
      setShowScrollbar(true);

      // 기존 타임아웃이 있다면 클리어
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // 1초 후에 스크롤바 숨김
      hideTimeoutRef.current = setTimeout(() => {
        setShowScrollbar(false);
      }, 2000);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [ref]);

  // 컨테이너 높이가 총 컨텐츠 높이보다 크면 스크롤바가 필요없으므로 숨김
  const isScrollbarNeeded = totalContentHeight > containerHeight;

  // thumb 높이 계산: 컨테이너 높이 * (컨테이너 높이 / 컨텐츠 전체 높이)
  const thumbHeight = containerHeight * (containerHeight / totalContentHeight);
  const safeThumbHeight = thumbHeight === Infinity ? 1 : thumbHeight;

  const prevTotalContentHeight = useRef(totalContentHeight);

  const effectiveProgress = useSpring(0, { stiffness: 300, damping: 20 });
  useMotionValueEvent(scrollYProgress, 'change', (latestValue) => {
    if (isScrollbarNeeded) {
      effectiveProgress.set(latestValue);
    } else {
      effectiveProgress.set(0);
    }
  });

  useEffect(() => {
    if (prevTotalContentHeight.current !== totalContentHeight) {
      if (ref.current) {
        ref.current.scrollTop = 0;
      }
      setTimeout(() => {
        effectiveProgress.set(0);
      }, 0);
      prevTotalContentHeight.current = totalContentHeight;
    }
  }, [totalContentHeight]);

  const thumbTop = useTransform(effectiveProgress, [0, 1], [0, containerHeight - safeThumbHeight]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 14,
        height: containerHeight,
        backgroundColor,
        opacity: isScrollbarNeeded && showScrollbar ? 1 : 0,
        pointerEvents: isScrollbarNeeded && showScrollbar ? 'auto' : 'none',
        transition: 'opacity 0.16s',
        borderLeft: border,
      }}
    >
      <motion.div
        drag='y'
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(_, info) => {
          if (ref.current) {
            ref.current.scrollTop = info.point.y;
          }
        }}
        style={{
          position: 'absolute',
          left: 2.8,
          width: 8,
          height: safeThumbHeight,
          backgroundColor: '#cccccc',
          borderRadius: 4,
          top: thumbTop,
          cursor: 'pointer',
          transition: 'top 0.2s ease-out',
        }}
      />
    </motion.div>
  );
}
