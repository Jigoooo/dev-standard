import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Button,
  ButtonStyle,
  createHeader,
  DateEditCell,
  InputNumberEditCell,
  dialogActions,
  DialogType,
  ModalLayout,
  THeader,
  useModal,
  ExcelEditModal,
  TValidationRuleWithHeaderId,
} from '@/shared/ui';
import { getExcelDataListApi } from '../api/excel-api.ts';
import { TExcelInfo, TExcelData, RExcelData } from '../model/excel-upload-download-type.ts';
import { useUpdateExcelMutation } from '@/entities/excel-upload-download';
import { colors } from '@/shared/constants';
import { handleAuthError } from '@/entities/auth';
import { formatDateString, thousandSeparator } from '@/shared/lib';

export function useExcelUploadDownloadHeaders() {
  const excelUploadValidationRules: TValidationRuleWithHeaderId<TExcelData>[] = [
    {
      id: 'quantity',
      validateFn: () => true,
    },
    {
      id: 'price',
      validateFn: () => true,
    },
    {
      id: 'totalAmount',
      validateFn: () => true,
    },
    {
      id: 'orderDate',
      validateFn: () => true,
    },
    {
      id: 'status',
      validateFn: () => true,
    },
  ];

  const excelUploadDataHeaders: THeader<TExcelData>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('orderNo', '주문번호', 150),
    createHeader('productCode', '상품코드', 150),
    createHeader('productName', '상품명', 150),
    createHeader('quantity', '수량', 80, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeader('price', '단가', 100, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeader('totalAmount', '가격', 100, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeader('orderDate', '주문일자', 120, {
      editCell: (editCellOptions) => {
        return <DateEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return formatDateString(cellData, '-');
      },
    }),
    createHeader('customerName', '주문자', 100),
    createHeader('status', '상태', 100),
    createHeader('button', '', 80, {
      pin: 'right',
      dataAlign: 'center',
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
      filter: undefined,
    }),
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

          toast.success('엑셀 수정 성공');

          close();
        },
      },
    );
  };

  const navigate = useNavigate();
  const excelEditModal = useModal();
  const excelEditModalOpen = async (rowData: TExcelInfo) => {
    let response = await getExcelDataListApi({
      idx: rowData.idx,
    });

    const isError = await handleAuthError({
      data: response,
      onUnauthenticated: () => navigate('/', { replace: true }),
      onRefreshSuccess: () => {},
    });

    if (isError) {
      response = await getExcelDataListApi({
        idx: rowData.idx,
      });
    }

    const excelDataList = response.data?.excelDataList ?? [];
    const excelDataWithIndex: TExcelData[] = excelDataList.map((item, index) => ({
      ...item,
      index: index + 1,
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
            validationRules={excelUploadValidationRules}
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
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('excelNm', '업로드 제목', 200),
    createHeader('insDt', '업로드 일자', 180, {
      formatter: ({ cellData }) => {
        const date = new Date(cellData);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      },
    }),
    createHeader('insMember', '등록자', 150),
    createHeader('updDt', '수정 일자', 180, {
      formatter: ({ cellData }) => {
        const date = new Date(cellData);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      },
    }),
    createHeader('updMember', '수정자', 150),
    createHeader('button', '', 80, {
      dataAlign: 'center',
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
      filter: undefined,
    }),
  ];

  return { excelUploadValidationRules, excelUploadListHeaders, excelUploadDataHeaders };
}
