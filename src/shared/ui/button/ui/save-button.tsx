import { Button } from './button.tsx';
import { ButtonProps } from '../model/button-type.ts';

export function SaveButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      style={{
        ...{ width: '5rem' },
        ...style,
      }}
      {...props}
    >
      저장
    </Button>
  );
}
