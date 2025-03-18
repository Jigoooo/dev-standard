import { Button, ButtonStyle, THeader } from '@/shared/ui';
import { TExcelInfo } from '../model/';
import { getExcelDataListApi } from '@/entities/excel-upload-download/api/excel-api.ts';

export function useExcelUploadDownloadHeaders(): THeader<TExcelInfo>[] {
  // const excelEditModal = useModal();
  const excelEditModalOpen = async (rowData: TExcelInfo) => {
    const response = await getExcelDataListApi({
      idx: rowData.idx,
    });
    const excelDataList = response.data?.excelDataList ?? [];
    console.log(excelDataList);

    // const headers = [];
    // const rows = [];
    //
    // excelEditModal.open(({ overlayRef, close }) => {
    //   return (
    //     <ModalLayout
    //       overlayRef={overlayRef}
    //       containerStyle={{ width: 1200, height: 800 }}
    //       title={'엑셀 편집'}
    //       close={close}
    //     >
    //       <ExcelEditModal
    //         maxWidth={1200}
    //         headers={headers}
    //         rows={rows}
    //         close={(dataList) => {
    //           console.log(dataList);
    //           close();
    //         }}
    //       />
    //     </ModalLayout>
    //   );
    // });
  };

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
      cell: ({ rowData }) => {
        return (
          <Button
            buttonStyle={ButtonStyle.OUTLINED}
            style={{ width: '100%', height: 30, fontSize: '0.76rem' }}
            onClick={() => excelEditModalOpen(rowData)}
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
