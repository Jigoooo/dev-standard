import { useState } from 'react';
import XLSX from 'xlsx-js-style';

import {
  Button,
  dialogActions,
  DialogType,
  FileUploadForm,
  FlexColumn,
  FlexRow,
  TFile,
} from 'shared/ui';
import { isExtensionAllowed } from '@/shared/lib';

export function ExcelUploadModal() {
  const [files, setFiles] = useState<TFile[]>([]);
  const handleFiles = async (files: TFile[]) => {
    if (
      !isExtensionAllowed({
        extensions: ['.xls', '.xlsx'],
        fileName: files[0].file.name,
      })
    ) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '업로드 실패',
        contents: '허용되지 않는 파일이에요',
      });

      return;
    }

    setFiles(files);
  };
  const deleteFile = (fileUUID: string) => {
    setFiles((prevState) => {
      return prevState.filter((file) => file.fileUUID !== fileUUID);
    });
  };

  const readExcelFile = async () => {
    if (files.length === 0) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '편집 대상 파일이 없습니다.',
        overlayClose: true,
      });

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
          <FileUploadForm files={files} handleFiles={handleFiles} fileDelete={deleteFile} />
        </div>
        <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <Button style={{ paddingInline: 18, backgroundColor: '#333333' }} onClick={readExcelFile}>
            편집
          </Button>
          <Button style={{ paddingInline: 18 }} onClick={() => {}}>
            업로드
          </Button>
        </FlexRow>
      </FlexColumn>
    </FlexRow>
  );
}
