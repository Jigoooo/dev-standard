import { Button } from './button.tsx';
import { ButtonProps, ButtonStyle } from '../model/button-type.ts';

export function ModifyButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      buttonStyle={ButtonStyle.OUTLINED}
      style={{
        ...{ width: '100%', height: 30, fontSize: '0.76rem' },
        ...style,
      }}
      {...props}
    >
      수정
    </Button>
  );
}
