import { FlexColumn, FlexRow, Button, useModal, ModalLayout } from '@/shared/components';
import { FileUploadModal } from '@/entities/file-upload-download';

export function FileUploadDownload() {
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

  return (
    <FlexColumn
      style={{
        height: '100%',
        paddingBlock: 16,
        paddingInline: 16,
        overflowY: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FlexRow>
        <Button onClick={fileUploadModalOpen}>파일 업로드</Button>
      </FlexRow>
    </FlexColumn>
  );
}
