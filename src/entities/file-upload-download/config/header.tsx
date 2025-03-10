import { THeader } from '@/shared/components';
import { TFileDownload } from '@/entities/file-upload-download';

export const fileDownloadHeaders: THeader<TFileDownload>[] = [
  {
    id: 'index',
    pin: 'left',
    align: 'right',
    label: '',
    width: 60,
    sorter: {
      sortable: false,
    },
  },
  {
    id: 'fileUploadTitle',
    pin: 'view',
    align: 'left',
    label: '업로드 제목',
    width: 200,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'note',
    pin: 'view',
    align: 'left',
    label: '비고',
    width: 300,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'uploadDateTime',
    pin: 'view',
    align: 'left',
    label: '업로드 일자',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
  {
    id: 'uploadUser',
    pin: 'view',
    align: 'left',
    label: '등록자',
    width: 150,
    sorter: {
      sortable: true,
      direction: null,
    },
    filter: {
      filterType: 'text',
      filterValue: '',
    },
  },
];
