import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { createHeader, dialog, FileDownloadButton, THeader } from '@/shared/ui';
import { TFileListItem } from '@/entities/file-upload-download';
import { thousandSeparator } from '@/shared/lib';
import { apiRequest, downloadFileApi, handleAuthError } from '@/shared/api';

export function useFileUploadDownloadHeaders(): THeader<TFileListItem>[] {
  const navigate = useNavigate();

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
            onClick={async () => {
              const response = await apiRequest(
                downloadFileApi({
                  fileIdx: rowData.fileIdx,
                }),
              );

              const isError = await handleAuthError({
                data: response,
                onUnauthenticated: () => navigate('/', { replace: true }),
                onRefreshSuccess: () => {},
              });

              if (isError) {
                const response = await apiRequest(
                  downloadFileApi({
                    fileIdx: rowData.fileIdx,
                  }),
                );

                if (!response.success) {
                  dialog.error({
                    title: '다운로드 실패',
                    contents: response.msg ?? '관리자에게 문의해 주세요.',
                  });
                  return;
                }
              }
            }}
          />
        );
      },
      filter: undefined,
    }),
  ];
}
