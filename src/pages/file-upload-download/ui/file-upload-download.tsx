import { useState } from 'react';

import { FlexColumn, TFile, FileUploadForm, FlexRow } from '@/shared/components';

export function FileUploadDownload() {
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
      <FlexRow style={{ width: '50%', minWidth: 500 }}>
        <FileUploadForm
          multiple={true}
          limitMB={3}
          files={files}
          handleFiles={handleFiles}
          fileDelete={deleteFile}
        />
      </FlexRow>
    </FlexColumn>
  );
}
