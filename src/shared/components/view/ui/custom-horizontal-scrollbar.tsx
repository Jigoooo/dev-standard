import { RefObject, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type CustomHorizontalScrollbarProps = {
  ref: RefObject<HTMLDivElement | null>;
  isTimeoutHiding?: boolean;
  totalContentWidth: number;
  leftOffset?: number;
  rightOffset?: number;
};

export function CustomHorizontalScrollbar({
  ref,
  isTimeoutHiding = false,
  totalContentWidth,
  leftOffset = 0,
  rightOffset = 0,
}: CustomHorizontalScrollbarProps) {
  const { scrollXProgress } = useScroll({ container: ref });

  const [containerWidth, setContainerWidth] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth);
    }
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
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
      setShowScrollbar(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
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
  }, [ref, isTimeoutHiding]);

  // 컨테이너 너비가 컨텐츠 전체 너비보다 크면 스크롤바가 필요없으므로 숨김
  const isScrollbarNeeded = totalContentWidth > containerWidth;

  // thumb 너비 계산: 컨테이너 너비 * (컨테이너 너비 / 컨텐츠 전체 너비)
  const thumbWidth = containerWidth * (containerWidth / totalContentWidth);

  // scrollXProgress를 이용해 thumb의 left 위치를 계산 (최대 left 값은 containerWidth - thumbWidth)
  const thumbLeft = useTransform(scrollXProgress, [0, 1], [0, containerWidth - thumbWidth]);

  return (
    <>
      {isScrollbarNeeded && showScrollbar && leftOffset !== 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 14,
            width: leftOffset,
            backgroundColor: '#f1f1f1',
            borderTop: '1px solid #bdc3c7',
          }}
        />
      )}
      <motion.div
        style={{
          position: 'absolute',
          left: leftOffset - 1,
          bottom: 0,
          height: 14,
          width: containerWidth + 2,
          backgroundColor: '#f1f1f1',
          opacity: isScrollbarNeeded && showScrollbar ? 1 : 0,
          pointerEvents: isScrollbarNeeded && showScrollbar ? 'auto' : 'none',
          transition: 'opacity 0.16s',
          border: '1px solid #bdc3c7',
        }}
      >
        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(_, info) => {
            if (ref.current) {
              ref.current.scrollLeft += info.offset.x;
            }
          }}
          style={{
            position: 'absolute',
            left: thumbLeft,
            bottom: 2.6,
            height: 8,
            width: thumbWidth,
            backgroundColor: '#cccccc',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'left 0.2s ease-out',
          }}
        />
      </motion.div>
      {isScrollbarNeeded && showScrollbar && rightOffset !== 0 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: 14,
            width: rightOffset,
            backgroundColor: '#f1f1f1',
            borderLeft: '1px solid #bdc3c7',
            borderTop: '1px solid #bdc3c7',
          }}
        />
      )}
    </>
  );
}
