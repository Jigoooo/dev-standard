import { Button, ButtonStyle, THeader } from 'shared/ui';
import { TExcelInfo } from '../model/';

export function useExcelUploadDownloadHeaders(): THeader<TExcelInfo>[] {
  return [
    {
      id: 'index',
      pin: 'left',
      dataAlign: 'right',
      label: '',
      width: 60,
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'excelNm',
      pin: 'view',
      dataAlign: 'left',
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
      id: 'insDt',
      pin: 'view',
      dataAlign: 'left',
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
      id: 'insMember',
      pin: 'view',
      dataAlign: 'left',
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
    {
      id: 'updDt',
      pin: 'view',
      dataAlign: 'left',
      label: '수정 일자',
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
      id: 'updMember',
      pin: 'view',
      dataAlign: 'left',
      label: '수정자',
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
      id: 'button',
      pin: 'view',
      dataAlign: 'center',
      label: '',
      width: 80,
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
      sorter: {
        sortable: false,
        direction: null,
      },
    },
  ];
}
