import { MdOutlineFileDownload } from 'react-icons/md';

import { Button, ButtonStyle, FlexRow, Typography } from '@/shared/ui';
import { ButtonProps } from '../model/button-type.ts';

export function ExcelExportButton({ ...props }: Omit<ButtonProps, 'children'>) {
  return (
    <Button
      buttonStyle={ButtonStyle.OUTLINED}
      style={{ color: '#666666', borderColor: '#333333' }}
      {...props}
    >
      <FlexRow style={{ alignItems: 'center', gap: 4 }}>
        <MdOutlineFileDownload style={{ fontSize: '1.2rem', color: '#333333' }} />
        <Typography style={{ fontSize: '0.82rem', color: '#333333' }}>Excel Export</Typography>
      </FlexRow>
    </Button>
  );
}
