import {
  Button,
  ButtonStyle,
  dialogActions,
  DialogType,
  ModalLayout,
  THeader,
  useModal,
} from '@/shared/ui';
import { getExcelDataListApi } from '../api/excel-api.ts';
import { TExcelInfo, TExcelData, RExcelData } from '../model/excel-upload-download-type.ts';
import { ExcelEditModal } from '../ui/excel-edit-modal.tsx';
import { useUpdateExcelMutation } from '@/entities/excel-upload-download';
import { colors } from '@/shared/constants';
import { toast } from 'sonner';

export function useExcelUploadDownloadHeaders() {
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
    {
      id: 'button',
      pin: 'right',
      dataAlign: 'center',
      label: '',
      width: 80,
      cell: ({ deleteRow }) => {
        return (
          <Button
            buttonStyle={ButtonStyle.OUTLINED}
            style={{
              width: '100%',
              height: 30,
              fontSize: '0.76rem',
              borderColor: colors.error[500],
              color: colors.error[500],
            }}
            onClick={deleteRow}
          >
            삭제
          </Button>
        );
      },
      sorter: {
        sortable: false,
        direction: null,
      },
    },
  ];

  const updateExcelMutation = useUpdateExcelMutation();
  const updateExcel = ({
    excelNm,
    rowData,
    excelDataList,
    dataList,
    close,
  }: {
    excelNm: string;
    rowData: TExcelInfo;
    excelDataList: RExcelData[];
    dataList: TExcelData[];
    close: () => void;
  }) => {
    const dataListWithoutIndex = dataList.map((item) => {
      const { index: _index, ...rest } = item;
      return rest;
    });

    const deletedDataList = excelDataList
      .filter(
        (originalRow) =>
          originalRow.rowIdx !== undefined &&
          !dataList.some((updatedRow) => updatedRow.rowIdx === originalRow.rowIdx),
      )
      .map((deletedData) => deletedData.rowIdx ?? -1);

    updateExcelMutation.mutate(
      {
        idx: rowData.idx,
        excelNm,
        excelDataList: dataListWithoutIndex,
        deleteDataList: deletedDataList,
      },
      {
        onSuccess: (data) => {
          if (!data.success) {
            dialogActions.open({
              title: '엑셀 수정 실패',
              contents: data?.msg ?? '관리자에게 문의해 주세요.',
              dialogType: DialogType.ERROR,
            });
            return;
          }

          toast.success('엑셀 수정 성공', {
            duration: 3000,
          });

          close();
        },
      },
    );
  };

  const excelEditModal = useModal();
  const excelEditModalOpen = async (rowData: TExcelInfo) => {
    const response = await getExcelDataListApi({
      idx: rowData.idx,
    });
    const excelDataList = response.data?.excelDataList ?? [];
    const excelDataWithIndex: TExcelData[] = excelDataList.map((item, index) => ({
      ...item,
      index: (index + 1).toString(),
    }));

    excelEditModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 1200, height: 800 }}
          title={'엑셀 편집'}
          close={close}
        >
          <ExcelEditModal
            excelNm={rowData.excelNm}
            headers={excelUploadDataHeaders}
            rows={excelDataWithIndex}
            maxWidth={1200}
            close={({ excelNm, dataList }) => {
              dialogActions.open({
                title: '수정하시겠습니까?',
                withCancel: true,
                overlayClose: true,
                onConfirm: () => {
                  updateExcel({ excelNm, rowData, excelDataList, dataList, close });
                },
              });
            }}
          />
        </ModalLayout>
      );
    });
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

  return { excelUploadListHeaders, excelUploadDataHeaders };
}
