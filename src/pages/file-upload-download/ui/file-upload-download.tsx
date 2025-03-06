import { FlexColumn } from '@/shared/components';
import { FileUploadForm } from '@/shared/components/file/ui/file-upload-form.tsx';

export function FileUploadDownload() {
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
      <FileUploadForm
        files={[]}
        handleFiles={(file) => {
          console.log(file);
        }}
        fileDelete={() => {}}
      />
    </FlexColumn>
  );
}
