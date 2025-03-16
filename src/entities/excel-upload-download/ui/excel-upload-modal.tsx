import { useState } from 'react';

import { Button, FileUploadForm, FlexColumn, FlexRow, TFile } from 'shared/ui';
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

    setFiles((prevState) => [...prevState, ...files]);
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

  return (
    <FlexRow style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FlexColumn style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: '80%' }}>
          <FileUploadForm
            multiple={true}
            files={files}
            handleFiles={handleFiles}
            fileDelete={deleteFile}
          />
        </div>
        <Button style={{ height: 42 }} onClick={readExcelFile}>
          분석
        </Button>
      </FlexColumn>
    </FlexRow>
  );
}
