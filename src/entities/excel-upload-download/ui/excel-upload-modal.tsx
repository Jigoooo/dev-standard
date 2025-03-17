import { useState } from 'react';

import {
  Button,
  FileUploadForm,
  FlexColumn,
  FlexRow,
  ModalLayout,
  TFile,
  useModal,
} from 'shared/ui';
import XLSX from 'xlsx-js-style';

export function ExcelUploadModal() {
  const [files, setFiles] = useState<TFile[]>([]);
  const handleFiles = async (files: TFile[]) => {
    console.log('file: ', files);
    // if (isExtensionNotAllowed(file.file.name)) {
    //   dialogActions.openDialog({
    //     dialogType: DialogType.ERROR,
    //     title: '업로드 실패',
    //     contents: '허용되지 않는 파일이에요',
    //   });
    //
    //   return;
    // }
    // const compressedFile = (await resizeImage({ file })) as File;

    setFiles(files);
  };
  const deleteFile = (fileUUID: string) => {
    setFiles((prevState) => {
      return prevState.filter((file) => file.fileUUID !== fileUUID);
    });
  };

  const readExcelFile = async () => {
    if (files.length === 0) {
      return;
    }

    const arrayBuffer = await files[0].file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rowData = XLSX.utils.sheet_to_json(sheet);

    console.log(rowData);
  };

  const excelUploadModal = useModal();
  const excelUploadModalOpen = () => {
    excelUploadModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 450 }}
          title={'파일 업로드'}
          close={close}
        >
          <ExcelUploadModal />
        </ModalLayout>
      );
    });
  };

  return (
    <FlexRow style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FlexColumn style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: '80%' }}>
          <FileUploadForm files={files} handleFiles={handleFiles} fileDelete={deleteFile} />
        </div>
        <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <Button style={{ paddingInline: 18, backgroundColor: '#333333' }} onClick={readExcelFile}>
            편집
          </Button>
          <Button style={{ paddingInline: 18 }} onClick={excelUploadModalOpen}>
            업로드
          </Button>
        </FlexRow>
      </FlexColumn>
    </FlexRow>
  );
}
