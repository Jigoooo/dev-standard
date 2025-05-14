import { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  DateFromToPicker,
  dialog,
  FlexColumn,
  FlexRow,
  ModalLayout,
  SearchButton,
  Table,
  useModal,
  useTableData,
  ExcelUploadModal,
  writeExcelFile,
  ButtonStyle,
} from '@/shared/ui';
import type { ExcelInfo, ExcelData } from '@/entities/excel-upload-download';
import { useExcelUploadDownloadHeaders } from '@/entities/excel-upload-download';
import { AnimatePresence, motion } from 'framer-motion';
import { colors } from '@/shared/constants';
import type { ExcelInfoListParameter } from '@/shared/api';
import {
  handleAuthError,
  useExcelDeleteMutation,
  useExcelInfoListQuery,
  useSaveExcelMutation,
} from '@/shared/api';

export function ExcelUploadDownload() {
  const navigate = useNavigate();

  const [excelInfoListParams, setExcelInfoListParams] = useState<ExcelInfoListParameter>({
    fromDate: format(new Date(), 'yyyy-MM-dd'),
    toDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const excelInfoListQuery = useExcelInfoListQuery({
    fromDate: excelInfoListParams.fromDate.replaceAll('-', ''),
    toDate: excelInfoListParams.toDate.replaceAll('-', ''),
  });
  const excelInfoList = excelInfoListQuery.data?.data?.excelInfoList ?? [];
  const excelInfoListWithIndex = excelInfoList.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  const search = () => {
    excelInfoListQuery.refetch();
  };

  const [deleteExcelIdxList, setDeleteExcelIdxList] = useState<number[]>([]);
  const handleDeleteExcelIdxList = (checkedList: string[]) => {
    const convertedDeleteIdxList = checkedList
      .map((checkIdx) => {
        const findExcelIdx = dataList.find((data) => data.index === Number(checkIdx));

        return findExcelIdx?.idx ?? -1;
      })
      .filter((excelIdx) => excelIdx !== -1);

    setDeleteExcelIdxList(convertedDeleteIdxList);
  };

  const {
    excelHeaderKeyLabels,
    excelUploadValidationRules,
    excelUploadDataHeaders,
    excelUploadListHeaders,
  } = useExcelUploadDownloadHeaders(search);
  const { dataList, setDataList, handelDataList, deleteDataList } =
    useTableData<ExcelInfo>(excelInfoListWithIndex);
  useEffect(() => {
    setDataList(excelInfoListWithIndex);
  }, [excelInfoListWithIndex]);

  const excelDeleteMutation = useExcelDeleteMutation();

  const registerExcelMutation = useSaveExcelMutation();
  const registerExcel = (excelNm: string, excelDataList: ExcelData[], close: () => void) => {
    dialog.info({
      title: '등록하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '등록',
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
                  dialog.error({
                    title: '엑셀 등록 실패',
                    contents: data?.msg ?? '관리자에게 문의해 주세요.',
                  });
                },
                onRefreshSuccess: () => {
                  registerExcelMutation.mutate(variables, {
                    onSuccess: (data) => {
                      if (data.success) {
                        toast.success('엑셀 수정 성공');
                        close();
                        search();
                      }
                    },
                  });
                },
              });

              if (!isError) {
                toast.success('엑셀 등록 성공');
                close();
                search();
              }
            },
          },
        );
      },
    });
  };

  const downloadExcelTemplate = () => {
    const excelTemplateHeaders = Array.from(excelHeaderKeyLabels.values());
    const exampleRow = [
      '2025031400002',
      'PRODUCT_002',
      '상품명_002',
      'a',
      '1000',
      '3003',
      '20250314',
      '홍주영',
      '주문 접수',
    ];

    writeExcelFile({
      excelFileName: '엑셀 업로드 양식',
      sheetName: '양식',
      rows: [excelTemplateHeaders, exampleRow],
      rowDataType: 'array',
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
            downloadExcelTemplate={downloadExcelTemplate}
          />
        </ModalLayout>
      );
    });
  };

  const deleteExcelList = () => {
    excelDeleteMutation.mutate(
      { deleteExcelList: deleteExcelIdxList },
      {
        onSuccess: async (data, variables) => {
          const isError = await handleAuthError({
            data,
            onUnauthenticated: () => navigate('/', { replace: true }),
            onOtherError: () => {
              dialog.error({
                title: '엑셀데이터 삭제에 실패하였습니다.',
                contents: data.msg ?? '관리자에게 문의해 주세요.',
              });
            },
            onRefreshSuccess: () => {
              excelDeleteMutation.mutate(variables, {
                onSuccess: (data) => {
                  if (data.success) {
                    toast.success('엑셀데이터가 삭제되었습니다.');
                    search();
                  }
                },
              });
            },
          });

          if (!isError) {
            toast.success('엑셀데이터가 삭제되었습니다.');
            search();
          }
        },
      },
    );
  };

  const deleteExcelListConfirmation = () => {
    dialog.info({
      title: '엑셀데이터를 삭제하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '삭제',
      onConfirm: () => {
        deleteExcelList();
      },
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
          <DateFromToPicker
            fromToDateString={{
              from: excelInfoListParams.fromDate,
              to: excelInfoListParams.toDate,
            }}
            onChange={(fromToDateString) => {
              setExcelInfoListParams((prevState) => {
                return {
                  ...prevState,
                  fromDate: fromToDateString.from,
                  toDate: fromToDateString.to,
                };
              });
            }}
          />
          <SearchButton onClick={search} />
        </FlexRow>
        <FlexRow style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <AnimatePresence>
            {deleteExcelIdxList.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
              >
                <Button
                  buttonStyle={ButtonStyle.OUTLINED}
                  style={{ borderColor: colors.error[500], color: colors.error[500] }}
                  onClick={deleteExcelListConfirmation}
                >
                  삭제
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button onClick={excelUploadModalOpen}>엑셀 업로드</Button>
        </FlexRow>
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
        handleSyncCheckList={handleDeleteExcelIdxList}
      />
    </FlexColumn>
  );
}
