import type { MouseEvent, RefObject } from 'react';

export const handleTrackMouseDown = ({
  event,
  ref,
  containerHeight,
  containerWidth,
  axis = 'vertical',
}: {
  event: MouseEvent<HTMLDivElement>;
  ref: RefObject<any>;
  containerHeight?: number;
  containerWidth?: number;
  axis?: 'vertical' | 'horizontal';
}) => {
  if (!ref.current) return;
  const container = ref.current;
  const rect = event.currentTarget.getBoundingClientRect();

  if (axis === 'vertical') {
    const clickY = event.clientY - rect.top;
    const clickRatio = clickY / (containerHeight ?? 0);
    const scrollableHeight = container.scrollHeight - container.clientHeight;
    const targetScrollTop = scrollableHeight * clickRatio;

    // 인터벌을 통해 점진적으로 스크롤 이동
    const interval = 10; // ms 단위
    const duration = 600; // 총 600ms 동안 이동
    const steps = duration / interval;
    const startScrollTop = container.scrollTop;
    const diff = targetScrollTop - startScrollTop;
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newScrollTop = startScrollTop + diff * progress;
      container.scrollTop = newScrollTop;
      if (currentStep >= steps) {
        clearInterval(intervalId);
      }
    }, interval);

    const handleMouseUp = () => {
      clearInterval(intervalId);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mouseup', handleMouseUp);
  } else {
    // horizontal 스크롤 처리
    const clickX = event.clientX - rect.left;
    const clickRatio = clickX / (containerWidth ?? 0);
    const scrollableWidth = container.scrollWidth - container.clientWidth;
    const targetScrollLeft = scrollableWidth * clickRatio;

    const interval = 10; // ms 단위
    const duration = 600; // 600ms 동안 이동
    const steps = duration / interval;
    const startScrollLeft = container.scrollLeft;
    const diff = targetScrollLeft - startScrollLeft;
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      container.scrollLeft = startScrollLeft + diff * progress;
      if (currentStep >= steps) {
        clearInterval(intervalId);
      }
    }, interval);

    const handleMouseUp = () => {
      clearInterval(intervalId);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mouseup', handleMouseUp);
  }
};
