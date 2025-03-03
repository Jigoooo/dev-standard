import { RefObject, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type CustomVerticalScrollbarProps = {
  ref: RefObject<HTMLDivElement | null>;
  totalContentHeight: number;
};

export function CustomVerticalScrollbar({ ref, totalContentHeight }: CustomVerticalScrollbarProps) {
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

  // 스크롤 진행도(scrollYProgress)를 이용해 thumb의 top 위치를 계산합니다.
  // 최대 top 값은 containerHeight - thumbHeight입니다.
  const thumbTop = useTransform(scrollYProgress, [0, 1], [0, containerHeight - thumbHeight]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 10,
        height: containerHeight,
        backgroundColor: 'transparent',
        opacity: isScrollbarNeeded && showScrollbar ? 1 : 0,
        pointerEvents: isScrollbarNeeded && showScrollbar ? 'auto' : 'none',
        transition: 'opacity 0.16s',
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
          left: 0,
          width: '100%',
          height: thumbHeight,
          backgroundColor: '#dfdfdf',
          borderRadius: 4,
          top: thumbTop,
          cursor: 'pointer',
        }}
      />
    </motion.div>
  );
}
