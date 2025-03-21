import { Button, ButtonStyle, createHeader, THeader } from '@/shared/ui';
import { TFileListItem } from '@/entities/file-upload-download';
import { thousandSeparator } from '@/shared/lib';
import { format } from 'date-fns';

export function useFileUploadDownloadHeaders(): THeader<TFileListItem>[] {
  return [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('fileNm', '파일명', 220),
    createHeader('fileSize', '파일 Size', 140, {
      dataAlign: 'right',
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData) + ' Byte';
      },
    }),
    createHeader('insDt', '업로드 일자', 180, {
      formatter: ({ cellData }) => {
        const date = new Date(cellData);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      },
    }),
    createHeader('insMember', '등록자', 150),
    createHeader('button', '', 80, {
      dataAlign: 'center',
      cell: () => {
        return (
          <Button
            buttonStyle={ButtonStyle.OUTLINED}
            style={{ width: '100%', height: 30, fontSize: '0.76rem' }}
          >
            상세
          </Button>
        );
      },
      filter: undefined,
    }),
  ];
}
