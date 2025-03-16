import { useState } from 'react';

import { FileUploadForm, FlexRow, TFile } from 'shared/ui';

export function FileUploadModal() {
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
    <FlexRow style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FileUploadForm
        multiple={true}
        limitMB={5}
        files={files}
        handleFiles={handleFiles}
        fileDelete={deleteFile}
      />
    </FlexRow>
  );
}
