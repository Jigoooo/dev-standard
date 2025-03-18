import { Button, ButtonStyle, THeader } from '@/shared/ui';
import { getExcelDataListApi } from '../api/excel-api.ts';
import { TExcelInfo, TExcelData } from '../model/excel-upload-download-type.ts';

export function useExcelUploadDownloadHeaders() {
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

  const excelUploadListHeaders: THeader<TExcelInfo>[] = [
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

  const excelUploadDataHeaders: THeader<TExcelData>[] = [
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
      id: 'orderNo',
      pin: 'view',
      dataAlign: 'left',
      label: '주문번호',
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
      id: 'productCode',
      pin: 'view',
      dataAlign: 'left',
      label: '상품코드',
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
      id: 'productName',
      pin: 'view',
      dataAlign: 'left',
      label: '상품명',
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
      id: 'quantity',
      pin: 'view',
      dataAlign: 'left',
      label: '수량',
      width: 80,
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
      id: 'price',
      pin: 'view',
      dataAlign: 'left',
      label: '단가',
      width: 100,
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
      id: 'totalAmount',
      pin: 'view',
      dataAlign: 'left',
      label: '가격',
      width: 100,
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
      id: 'orderDate',
      pin: 'view',
      dataAlign: 'left',
      label: '주문일자',
      width: 120,
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
      id: 'customerName',
      pin: 'view',
      dataAlign: 'left',
      label: '주문자',
      width: 100,
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
      id: 'status',
      pin: 'view',
      dataAlign: 'left',
      label: '상태',
      width: 100,
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

  return { excelUploadListHeaders, excelUploadDataHeaders };
}
