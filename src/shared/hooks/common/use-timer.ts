import { useEffect, useState, useCallback } from 'react';

export function useTimer(
  initialSeconds: number,
  start: boolean = true,
): { formatTime: string; resetTimer: () => void; stopTimer: () => void; startTimer: () => void } {
  const [timerValue, setTimerValue] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(start);

  const resetTimer = useCallback(() => {
    setTimerValue(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    setTimerValue(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimerValue((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  return { formatTime: formatTime(timerValue), resetTimer, stopTimer, startTimer };
}

const formatTime = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;

  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};
