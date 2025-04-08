import { Button } from './button.tsx';
import type { ButtonProps } from '../model/button-type.ts';
import { ButtonStyle } from '../model/button-type.ts';
import { colors } from '@/shared/constants';

export function DeleteButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      buttonStyle={ButtonStyle.OUTLINED}
      style={{
        ...{
          width: '100%',
          height: '1.9rem',
          borderColor: colors.error[500],
          color: colors.error[500],
        },
        ...style,
      }}
      {...props}
    >
      삭제
    </Button>
  );
}
