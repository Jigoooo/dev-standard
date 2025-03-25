import { Button } from './button.tsx';
import { ButtonProps } from '../model/button-type.ts';

export function SaveButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      style={{
        ...{ width: 80, fontSize: '0.82rem' },
        ...style,
      }}
      {...props}
    >
      저장
    </Button>
  );
}
