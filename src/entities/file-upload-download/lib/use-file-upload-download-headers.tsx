import { createHeader, FileDownloadButton, THeader } from '@/shared/ui';
import { downloadFileApi, TFileListItem } from '@/entities/file-upload-download';
import { thousandSeparator } from '@/shared/lib';
import { format } from 'date-fns';

export function useFileUploadDownloadHeaders(): THeader<TFileListItem>[] {
  return [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('check', '', 60, { pin: 'left', dataAlign: 'center', filter: undefined }),
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
    createHeader('button', '', 100, {
      dataAlign: 'center',
      cell: ({ rowData }) => {
        return (
          <FileDownloadButton
            style={{ height: 30 }}
            onClick={() => {
              //todo 에러, 토큰 처리 추가
              downloadFileApi({
                fileIdx: rowData.fileIdx,
              });
            }}
          />
        );
      },
      filter: undefined,
    }),
  ];
}
