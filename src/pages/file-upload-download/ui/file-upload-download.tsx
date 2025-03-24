import { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';

import {
  Button,
  ButtonStyle,
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
} from '@/shared/ui';
import {
  FileUploadModal,
  TFileListItem,
  useDeleteFileMutation,
  useFileUploadDownloadHeaders,
  useGetFileList,
  PFileListItem,
} from '@/entities/file-upload-download';
import { colors } from '@/shared/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { handleAuthError } from '@/entities/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function FileUploadDownload() {
  const navigate = useNavigate();

  const [fileListParams, setFileListParams] = useState<PFileListItem>({
    fromDate: format(new Date(), 'yyyy-MM-dd'),
    toDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const fileDownloadHeaders = useFileUploadDownloadHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<TFileListItem>([]);
  const [deleteFileIdxList, setDeleteFileIdxList] = useState<number[]>([]);
  const handleDeleteFileIdxList = (checkedList: string[]) => {
    const convertedDeleteIdxList = checkedList
      .map((checkIdx) => {
        const findFileIdx = dataList.find((data) => data.index === Number(checkIdx));

        return findFileIdx?.fileIdx ?? -1;
      })
      .filter((fileIdx) => fileIdx !== -1);

    setDeleteFileIdxList(convertedDeleteIdxList);
  };

  const deleteFileMutation = useDeleteFileMutation();

  const getFileListQuery = useGetFileList({
    fromDate: fileListParams.fromDate.replaceAll('-', ''),
    toDate: fileListParams.toDate.replaceAll('-', ''),
  });
  const fileList = getFileListQuery.data?.data?.fileList ?? [];

  const search = () => {
    getFileListQuery.refetch();
  };

  useEffect(() => {
    if (getFileListQuery.data?.data?.fileList) {
      const fileListWithIndex = fileList.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      setDataList(fileListWithIndex);
    }
  }, [getFileListQuery.data?.data?.fileList]);

  const fileUploadModal = useModal();
  const fileUploadModalOpen = () => {
    fileUploadModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 900 }}
          title={'파일 업로드'}
          close={close}
        >
          <FileUploadModal />
        </ModalLayout>
      );
    });
  };

  const deleteFileList = () => {
    deleteFileMutation.mutate(
      { deleteFileList: deleteFileIdxList },
      {
        onSuccess: async (data, variables) => {
          const isError = await handleAuthError({
            data,
            onUnauthenticated: () => navigate('/', { replace: true }),
            onOtherError: () => {
              dialogActions.open({
                dialogType: DialogType.ERROR,
                title: '파일 삭제에 실패하였습니다.',
                contents: data.msg ?? '관리자에게 문의해 주세요.',
              });
            },
            onRefreshSuccess: () => {
              deleteFileMutation.mutate(variables, {
                onSuccess: (data) => {
                  if (data.success) {
                    toast.success('파일이 삭제되었습니다.');
                  }
                },
              });
            },
          });

          if (!isError) {
            toast.success('파일이 삭제되었습니다.');
          }
        },
      },
    );
  };

  const deleteFileListConfirmation = () => {
    dialogActions.open({
      title: '파일을 삭제하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '삭제',
      onConfirm: () => {
        deleteFileList();
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
              from: fileListParams.fromDate,
              to: fileListParams.toDate,
            }}
            onChange={(fromToDateString) => {
              setFileListParams((prevState) => {
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
            {deleteFileIdxList.length > 0 && (
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
                  onClick={deleteFileListConfirmation}
                >
                  삭제
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button onClick={fileUploadModalOpen}>파일 업로드</Button>
        </FlexRow>
      </FlexRow>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: true,
        }}
        tableHeaders={fileDownloadHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        deleteDataList={deleteDataList}
        handleSyncCheckList={handleDeleteFileIdxList}
      />
    </FlexColumn>
  );
}
