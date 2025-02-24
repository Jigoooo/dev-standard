import { useState, KeyboardEvent } from 'react';

export function useFormTouchedController() {
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEnterPressed(true);
      setIsTouched(true);
    }
  };

  const resetEnterPress = () => {
    setIsEnterPressed(false);
  };

  return {
    isEnterPressed,
    setIsEnterPressed,
    isTouched,
    setIsTouched,
    handleKeyDown,
    resetEnterPress,
  };
}
