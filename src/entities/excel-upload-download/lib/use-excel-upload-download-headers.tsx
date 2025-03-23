import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import {
  createHeader,
  createHeaderFromId,
  InputNumberEditCell,
  dialogActions,
  DialogType,
  ModalLayout,
  THeader,
  useModal,
  ExcelEditModal,
  TValidationRuleWithHeaderId,
  DeleteButton,
  ModifyButton,
  SelectEditCell,
} from '@/shared/ui';
import { getExcelDataListApi } from '../api/excel-api.ts';
import { TExcelInfo, TExcelData, RExcelData } from '../model/excel-upload-download-type.ts';
import { useUpdateExcelMutation } from '@/entities/excel-upload-download';
import { handleAuthError } from '@/entities/auth';
import { createValidator, formatDateString, thousandSeparator } from '@/shared/lib';
import { DateEditCell } from '@/shared/ui/table/ui/date-edit-cell.tsx';

export function useExcelUploadDownloadHeaders() {
  const excelHeaderKeyLabels = new Map<keyof RExcelData, string>([
    ['orderNo', '주문번호'],
    ['productCode', '상품코드'],
    ['productName', '상품명'],
    ['quantity', '수량'],
    ['price', '단가'],
    ['totalAmount', '가격'],
    ['orderDate', '주문일자'],
    ['customerName', '주문자'],
    ['status', '상태'],
  ]);

  const excelUploadValidationRules: TValidationRuleWithHeaderId<TExcelData>[] = [
    {
      id: 'quantity',
      validateFn: (value) => {
        const valueWithValidated = createValidator(value).isNumber().validate();

        return {
          isValid: !valueWithValidated.error,
          errorMessage: valueWithValidated.errorMessage,
        };
      },
    },
    {
      id: 'price',
      validateFn: (value) => {
        const valueWithValidated = createValidator(value).isNumber().validate();

        return {
          isValid: !valueWithValidated.error,
          errorMessage: valueWithValidated.errorMessage,
        };
      },
    },
    {
      id: 'totalAmount',
      validateFn: (value) => {
        const valueWithValidated = createValidator(value).isNumber().validate();

        return {
          isValid: !valueWithValidated.error,
          errorMessage: valueWithValidated.errorMessage,
        };
      },
    },
    {
      id: 'orderDate',
      validateFn: (value) => {
        const valueWithValidated = createValidator(value).isDate().validate();

        return {
          isValid: !valueWithValidated.error,
          errorMessage: valueWithValidated.errorMessage,
        };
      },
    },
  ];

  const excelUploadDataHeaders: THeader<TExcelData>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeaderFromId(excelHeaderKeyLabels, 'orderNo', 150),
    createHeaderFromId(excelHeaderKeyLabels, 'productCode', 150),
    createHeaderFromId(excelHeaderKeyLabels, 'productName', 150),
    createHeaderFromId(excelHeaderKeyLabels, 'quantity', 80, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeaderFromId(excelHeaderKeyLabels, 'price', 100, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeaderFromId(excelHeaderKeyLabels, 'totalAmount', 100, {
      dataAlign: 'right',
      editCell: (editCellOptions) => {
        return <InputNumberEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return thousandSeparator(cellData);
      },
    }),
    createHeaderFromId(excelHeaderKeyLabels, 'orderDate', 120, {
      editCell: (editCellOptions) => {
        return <DateEditCell {...editCellOptions} />;
      },
      formatter: ({ cellData }) => {
        return formatDateString(cellData, '-');
      },
    }),
    createHeaderFromId(excelHeaderKeyLabels, 'customerName', 100),
    createHeaderFromId(excelHeaderKeyLabels, 'status', 100, {
      editCell: (editCellOptions) => {
        return (
          <SelectEditCell
            {...editCellOptions}
            options={[
              { value: '1', label: 'Select 1' },
              { value: '2', label: '주문입건' },
              { value: '3', label: 'Select 3' },
              { value: '4', label: 'Select 4' },
              { value: '5', label: 'Select 5' },
              { value: '6', label: 'Select 6' },
              { value: '7', label: 'Select 7' },
              { value: '8', label: 'Select 8' },
              { value: '9', label: 'Select 9' },
              { value: '10', label: 'Select 10' },
              { value: '11', label: 'Select 11' },
              { value: '12', label: 'Select 12' },
              { value: '13', label: 'Select 13' },
              { value: '14', label: 'Select 14' },
              { value: '15', label: 'Select 15' },
            ]}
          />
        );
      },
    }),
    createHeader('button', '', 100, {
      pin: 'right',
      dataAlign: 'center',
      cell: ({ deleteRow }) => {
        return <DeleteButton onClick={deleteRow} />;
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
        onSuccess: async (data, variables) => {
          const isError = await handleAuthError({
            data,
            onUnauthenticated: () => navigate('/', { replace: true }),
            onOtherError: () => {
              dialogActions.open({
                title: '엑셀 수정 실패',
                contents: data?.msg ?? '관리자에게 문의해 주세요.',
                dialogType: DialogType.ERROR,
              });
            },
            onRefreshSuccess: () => {
              updateExcelMutation.mutate(variables, {
                onSuccess: (data) => {
                  if (data.success) {
                    toast.success('엑셀 수정 성공');
                    close();
                  }
                },
              });
            },
          });

          if (!isError) {
            toast.success('엑셀 수정 성공');
            close();
          }
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
                cancelText: '아니요',
                confirmText: '수정',
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
        return <ModifyButton onClick={() => excelEditModalOpen(rowData)} />;
      },
      filter: undefined,
    }),
  ];

  return {
    excelHeaderKeyLabels,
    excelUploadValidationRules,
    excelUploadListHeaders,
    excelUploadDataHeaders,
  };
}
