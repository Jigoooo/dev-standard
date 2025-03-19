import { IoSearchSharp } from 'react-icons/io5';

import { Button } from './button.tsx';
import { ButtonProps } from '../model/button-type.ts';

export function SearchButton({ style, ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      style={{
        ...{ width: 34, padding: 0, backgroundColor: '#555555' },
        ...style,
      }}
      {...props}
    >
      <IoSearchSharp style={{ fontSize: '1.1rem' }} />
    </Button>
  );
}
