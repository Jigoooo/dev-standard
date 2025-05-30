import { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Button,
  ButtonStyle,
  DateFromToPicker,
  dialog,
  FlexColumn,
  FlexRow,
  ModalLayout,
  SearchButton,
  Table,
  useModal,
  useTableData,
} from '@/shared/ui';
import type { FileListItem } from '@/entities/file-upload-download';
import { FileUploadModal, useFileUploadDownloadHeaders } from '@/entities/file-upload-download';
import { colors } from '@/shared/constants';
import type { FilesParameter } from '@/shared/api';
import {
  handleAuthError,
  useDeleteFileMutation,
  useGetFilesQuery,
  useFileSaveMutation,
} from '@/shared/api';
import { Router } from '@/shared/router';

export function FileUploadDownload() {
  const navigate = useNavigate();

  const [fileListParams, setFileListParams] = useState<FilesParameter>({
    fromDate: format(new Date(), 'yyyy-MM-dd'),
    toDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const fileDownloadHeaders = useFileUploadDownloadHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<FileListItem>([]);
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

  const getFileListQuery = useGetFilesQuery({
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

  const fileSaveMutation = useFileSaveMutation();

  const fileUploadModal = useModal();
  const fileUploadModalOpen = () => {
    fileUploadModal.open(({ overlayRef, close }) => {
      const fileSave = (saveFiles: File[]) => {
        fileSaveMutation.mutate(
          {
            fileList: saveFiles,
          },
          {
            onSuccess: async (data, variables) => {
              const isError = await handleAuthError({
                data,
                onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
                onOtherError: () => {
                  dialog.error({
                    title: '파일 업로드 실패',
                    contents: data?.message ?? '관리자에게 문의해 주세요.',
                  });
                },
                onRefreshSuccess: () => {
                  fileSaveMutation.mutate(variables, {
                    onSuccess: (data) => {
                      if (data.isSuccess) {
                        toast.success('파일 업로드 성공');
                        close();
                        search();
                      }
                    },
                  });
                },
              });

              if (!isError) {
                toast.success('파일 업로드 성공');
                close();
                search();
              }
            },
          },
        );
      };

      const showSaveFileConfirmation = (saveFiles: File[]) => {
        dialog.info({
          title: '파일 업로드',
          contents: '파일을 업로드 하시겠습니까?',
          overlayClose: true,
          withCancel: true,
          cancelText: '아니요',
          confirmText: '업로드',
          onConfirm: () => fileSave(saveFiles),
        });
      };

      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 900 }}
          title={'파일 업로드'}
          close={close}
        >
          <FileUploadModal onSave={showSaveFileConfirmation} />
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
            onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
            onOtherError: () => {
              dialog.error({
                title: '파일 삭제에 실패하였습니다.',
                contents: data.message ?? '관리자에게 문의해 주세요.',
              });
            },
            onRefreshSuccess: () => {
              deleteFileMutation.mutate(variables, {
                onSuccess: (data) => {
                  if (data.isSuccess) {
                    toast.success('파일이 삭제되었습니다.');
                    search();
                  }
                },
              });
            },
          });

          if (!isError) {
            toast.success('파일이 삭제되었습니다.');
            search();
          }
        },
      },
    );
  };

  const deleteFileListConfirmation = () => {
    dialog.info({
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
