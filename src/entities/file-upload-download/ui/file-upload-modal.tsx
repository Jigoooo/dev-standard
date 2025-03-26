import { useState } from 'react';

import { Button, FileUploadForm, FlexColumn, FlexRow, TFile } from '@/shared/ui';

export function FileUploadModal({ onSave }: { onSave: (saveFiles: File[]) => void }) {
  const [files, setFiles] = useState<TFile[]>([]);
  const handleFiles = async (files: TFile[]) => {
    setFiles((prevState) => [...prevState, ...files]);
  };

  const deleteFile = (fileUUID: string) => {
    setFiles((prevState) => {
      return prevState.filter((file) => file.fileUUID !== fileUUID);
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
          <Button
            style={{ paddingInline: 18 }}
            onClick={() => {
              const saveFiles = files.map((file) => file.file);
              onSave(saveFiles);
            }}
          >
            업로드
          </Button>
        ) : (
          <div />
        )}
      </FlexRow>
    </FlexColumn>
  );
}
