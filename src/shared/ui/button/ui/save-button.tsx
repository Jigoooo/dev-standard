import { Button } from './button.tsx';
import { ButtonProps, ButtonStyle } from '../model/button-type.ts';

export function SaveButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      style={{
        ...{ width: 80 },
        ...style,
      }}
      {...props}
    >
      저장
    </Button>
  );
}
