import React, { useState, useRef, useEffect } from 'react';

export const useDraggable = (defaultPosition?: { x: number; y: number }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(
    defaultPosition && {
      x: 0,
      y: 0,
    },
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => handleMouseMove(event);
    const onMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
  };
};
