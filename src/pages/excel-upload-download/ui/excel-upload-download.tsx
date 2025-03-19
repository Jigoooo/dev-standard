import { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';

import {
  Button,
  DateFromToPicker,
  dialogActions,
  DialogType,
  FlexColumn,
  FlexRow,
  ModalLayout,
  SearchButton,
  Table,
  useModal,
  useTableData,
  ExcelUploadModal,
} from '@/shared/ui';
import {
  TExcelInfo,
  TExcelData,
  useExcelInfoListQuery,
  useExcelUploadDownloadHeaders,
  useSaveExcelMutation,
} from '@/entities/excel-upload-download';
import { toast } from 'sonner';
import { handleAuthError } from '@/entities/auth';
import { useNavigate } from 'react-router-dom';

export function ExcelUploadDownload() {
  const navigate = useNavigate();

  const excelInfoListQuery = useExcelInfoListQuery();
  const excelInfoList = excelInfoListQuery.data?.data?.excelInfoList ?? [];
  const excelInfoListWithIndex = excelInfoList.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  const { excelUploadValidationRules, excelUploadDataHeaders, excelUploadListHeaders } =
    useExcelUploadDownloadHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } =
    useTableData<TExcelInfo>(excelInfoListWithIndex);
  useEffect(() => {
    setDataList(excelInfoListWithIndex);
  }, [excelInfoListWithIndex]);

  const [fromToDateString, setFromToDateString] = useState({
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const registerExcelMutation = useSaveExcelMutation();
  const registerExcel = (excelNm: string, excelDataList: TExcelData[], close: () => void) => {
    dialogActions.open({
      title: '등록하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => {
        const excelDataListWithoutIndex = excelDataList.map((row) => {
          const { index: _index, ...rest } = row;
          return rest;
        });

        registerExcelMutation.mutate(
          {
            excelNm,
            excelDataList: excelDataListWithoutIndex,
          },
          {
            onSuccess: async (data, variables) => {
              const isError = await handleAuthError({
                data,
                onUnauthenticated: () => navigate('/', { replace: true }),
                onOtherError: () => {
                  dialogActions.open({
                    title: '엑셀 등록 실패',
                    contents: data?.msg ?? '관리자에게 문의해 주세요.',
                    dialogType: DialogType.ERROR,
                  });
                },
                onRefreshSuccess: () => {
                  registerExcelMutation.mutate(variables, {
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
                toast.success('엑셀 등록 성공');
                close();
              }
            },
          },
        );
      },
    });
  };

  const excelUploadModal = useModal();
  const excelUploadModalOpen = () => {
    excelUploadModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 450 }}
          title={'엑셀 업로드'}
          close={close}
        >
          <ExcelUploadModal
            headers={excelUploadDataHeaders}
            validationRules={excelUploadValidationRules}
            close={close}
            registerExcel={registerExcel}
            excelFormFileLink={'/excel-form/엑셀테스트.xlsx'}
          />
        </ModalLayout>
      );
    });
  };

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 6,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <FlexRow style={{ gap: 6 }}>
          <DateFromToPicker fromToDateString={fromToDateString} onChange={setFromToDateString} />
          <SearchButton
            onClick={() => {
              console.log('검색');
            }}
          />
        </FlexRow>
        <Button onClick={excelUploadModalOpen}>엑셀 업로드</Button>
      </FlexRow>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: true,
        }}
        tableHeaders={excelUploadListHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        deleteDataList={deleteDataList}
      />
    </FlexColumn>
  );
}
