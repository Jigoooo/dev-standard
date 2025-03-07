import { useState } from 'react';

import { FlexColumn, TFile, FileUploadForm } from '@/shared/components';

export function FileUploadDownload() {
  const [files, setFiles] = useState<TFile[]>([]);
  const handleFiles = (file: TFile) => {
    console.log('file: ', file);
    setFiles((prevState) => [...prevState, file]);
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
      <FileUploadForm files={files} handleFiles={handleFiles} fileDelete={deleteFile} />
    </FlexColumn>
  );
}
