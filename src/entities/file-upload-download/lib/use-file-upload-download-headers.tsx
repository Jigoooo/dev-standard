import { Button, ButtonStyle, createHeader, THeader } from 'shared/ui';
import { TFileDownload } from '@/entities/file-upload-download';

export function useFileUploadDownloadHeaders(): THeader<TFileDownload>[] {
  return [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('fileUploadTitle', '업로드 제목', 200),
    createHeader('note', '비고', 400),
    createHeader('uploadDateTime', '업로드 일자', 150),
    createHeader('uploadUser', '등록자', 150),
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
