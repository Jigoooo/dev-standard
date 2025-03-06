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
        attachments={[]}
        fileHandlerService={(file) => {
          console.log(file);
          return Promise.resolve({ path: '', idx: -1 });
        }}
        fileDelete={() => {}}
      />
    </FlexColumn>
  );
}
