import { IoSearchSharp } from 'react-icons/io5';

import { Button, ButtonProps } from '@/shared/components';

export function SearchButton(props: Omit<ButtonProps, 'children'>) {
  return (
    <Button style={{ width: 34, padding: 0, backgroundColor: '#555555' }} {...props}>
      <IoSearchSharp style={{ fontSize: '1.1rem' }} />
    </Button>
  );
}
