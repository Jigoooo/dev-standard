import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Button, dialog, FileUploadForm, FlexColumn, FlexRow, TFile } from '@/shared/ui';
import { useFileSaveMutation, handleAuthError } from '@/shared/api';

export function FileUploadModal() {
  const navigate = useNavigate();

  const [files, setFiles] = useState<TFile[]>([]);
  const handleFiles = async (files: TFile[]) => {
    setFiles((prevState) => [...prevState, ...files]);
  };

  const deleteFile = (fileUUID: string) => {
    setFiles((prevState) => {
      return prevState.filter((file) => file.fileUUID !== fileUUID);
    });
  };

  const fileSaveMutation = useFileSaveMutation();
  const fileSave = () => {
    const fileList = files.map((file) => {
      return file.file;
    });

    fileSaveMutation.mutate(
      {
        fileList,
      },
      {
        onSuccess: async (data, variables) => {
          const isError = await handleAuthError({
            data,
            onUnauthenticated: () => navigate('/', { replace: true }),
            onOtherError: () => {
              dialog.error({
                title: '파일 업로드 실패',
                contents: data?.msg ?? '관리자에게 문의해 주세요.',
              });
            },
            onRefreshSuccess: () => {
              fileSaveMutation.mutate(variables, {
                onSuccess: (data) => {
                  if (data.success) {
                    toast.success('파일 업로드 성공');
                    close();
                  }
                },
              });
            },
          });

          if (!isError) {
            toast.success('파일 업로드 성공');
            close();
          }
        },
      },
    );
  };

  const showSaveFileConfirmation = () => {
    dialog.info({
      title: '파일 업로드',
      contents: '파일을 업로드 하시겠습니까?',
      overlayClose: true,
      withCancel: true,
      cancelText: '아니요',
      confirmText: '업로드',
      onConfirm: fileSave,
    });
  };

  return (
    <FlexColumn style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FileUploadForm
        multiple={true}
        limitMB={5}
        files={files}
        handleFiles={handleFiles}
        fileDelete={deleteFile}
      />
      <FlexRow style={{ justifyContent: 'flex-end' }}>
        {files.length > 0 ? (
          <Button style={{ paddingInline: 18 }} onClick={showSaveFileConfirmation}>
            업로드
          </Button>
        ) : (
          <div />
        )}
      </FlexRow>
    </FlexColumn>
  );
}
