import { RefObject, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';

import { useKeepAliveScrollHistoryRef } from '@/shared/hooks';
import { handleTrackMouseDown } from '@/shared/ui';

type CustomHorizontalScrollbarProps = {
  ref: RefObject<HTMLDivElement | null>;
  isTimeoutHiding?: boolean;
  totalContentWidth: number;
  leftOffset?: number;
  rightOffset?: number;
  border?: string;
  backgroundColor?: string;
};

export function CustomHorizontalScrollbar({
  ref,
  isTimeoutHiding = false,
  totalContentWidth,
  leftOffset = 0,
  rightOffset = 0,
  border = '1px solid #bdc3c7',
  backgroundColor = '#f1f1f1',
}: CustomHorizontalScrollbarProps) {
  const { scrollXProgress, scrollX } = useScroll({ container: ref });
  const effectiveProgress = useMotionValue(0);

  const bodyHorizontalScrollHistoryRef = useKeepAliveScrollHistoryRef({
    ref,
    axis: 'horizontal',
    scrollResetAction: (scrollValue) => {
      if (scrollValue === 0) {
        setTimeout(() => {
          if (bodyHorizontalScrollHistoryRef.current) {
            bodyHorizontalScrollHistoryRef.current.scrollTop = 0;
          }

          effectiveProgress.set(0);
        }, 50);
      }
    },
  });

  const [containerWidth, setContainerWidth] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialScrollLeft = useRef(0);

  useEffect(() => {
    if (bodyHorizontalScrollHistoryRef.current) {
      setContainerWidth(bodyHorizontalScrollHistoryRef.current.clientWidth);
    }
  }, [bodyHorizontalScrollHistoryRef]);

  useEffect(() => {
    if (!bodyHorizontalScrollHistoryRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(bodyHorizontalScrollHistoryRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [bodyHorizontalScrollHistoryRef]);

  useEffect(() => {
    if (!isTimeoutHiding) {
      setShowScrollbar(true);
      return;
    }

    const container = bodyHorizontalScrollHistoryRef.current;
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
  }, [bodyHorizontalScrollHistoryRef, isTimeoutHiding]);

  const isScrollbarNeeded = totalContentWidth > containerWidth;

  const thumbWidth = containerWidth * (containerWidth / totalContentWidth);

  useMotionValueEvent(scrollXProgress, 'change', (latestValue) => {
    if (isScrollbarNeeded) {
      effectiveProgress.set(latestValue);
    } else {
      effectiveProgress.set(0);
    }
  });

  const thumbLeft = useTransform(effectiveProgress, [0, 1], [0, containerWidth - thumbWidth]);

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
            backgroundColor,
            borderTop: border,
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
          backgroundColor,
          opacity: isScrollbarNeeded && showScrollbar ? 1 : 0,
          pointerEvents: isScrollbarNeeded && showScrollbar ? 'auto' : 'none',
          transition: 'opacity 0.16s',
          borderLeft: border,
          borderTop: border,
        }}
        onMouseDown={(event) =>
          handleTrackMouseDown({
            event,
            ref: bodyHorizontalScrollHistoryRef,
            containerWidth,
            axis: 'horizontal',
          })
        }
      >
        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
          onDragStart={(event) => {
            event.stopPropagation();
            initialScrollLeft.current = scrollX.get();
          }}
          onDrag={(event, info) => {
            event.stopPropagation();
            if (bodyHorizontalScrollHistoryRef.current) {
              bodyHorizontalScrollHistoryRef.current.scrollLeft =
                initialScrollLeft.current + info.offset.x * 2.4;
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
          whileDrag={{ backgroundColor: '#999999' }}
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
            backgroundColor,
            borderLeft: border,
            borderTop: border,
          }}
        />
      )}
    </>
  );
}
