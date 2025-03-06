import { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';

// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';

import { DropZone } from './drop-zone.tsx';
import { fileSizeFormatter, resizeImage } from '@/shared/lib';
import { FlexColumn, FlexRow, Typography, TFile } from '@/shared/components';

export function FileUploadForm({
  attachments,
  fileHandlerService,
  fileDelete,
}: {
  attachments: any[];
  fileHandlerService: (file: TFile) => Promise<{ path: string; idx: number }>;
  fileDelete: (fileUUID: string) => void;
}) {
  const fileId = useId();

  const [files, setFiles] = useState<TFile[]>([]);
  useEffect(() => {
    setFiles(attachments);
  }, [attachments]);

  const totalFileSize = useMemo(() => {
    return files.reduce((acc, cur) => {
      const { sizeInMB } = fileSizeFormatter(cur.file.size);

      return acc + Number(sizeInMB);
    }, 0);
  }, [files]);

  const fileProgressNumber = useMemo(() => {
    return Math.round((Number(totalFileSize) / 10) * 100);
  }, [totalFileSize]);

  const handleFileList = async (file: File) => {
    const compressedFile = (await resizeImage({ file })) as File;
    const newFile: TFile = {
      fileUUID: uuidV4(),
      file: compressedFile,
    };

    console.log(newFile);

    fileHandlerService(newFile);

    // const fileUploadResponse = await fileHandlerService(compressedFile);

    // if (!fileUploadResponse.path) {
    //   setFileUploadLoading(false);
    //   return;
    // }

    // const { sizeInMB } = fileSizeFormatter(compressedFile.size);

    // if (currentTotalFileSize + sizeInMB > TOTAL_LIMIT_FILE_SIZE / 1024) {
    //   showNotification({ message: '파일 총합 사이즈는 10MB 를 넘을 수 없어요', color: 'danger' });
    //   setFileUploadLoading(false);
    //   return;
    // }

    setFiles((state) => [...state, newFile]);
  };

  const deleteFile = (file: TFile) => {
    setFiles((state) => state.filter((item) => item.fileUUID !== file.fileUUID));
    fileDelete(file.fileUUID);
  };

  return (
    <FlexColumn>
      <FlexColumn style={{ marginBlock: 8, gap: 8 }}>
        <FlexRow style={{ alignItems: 'center', gap: 8 }}>
          <Typography style={{ fontWeight: 600 }}>최대 업로드 용량</Typography>
          {/*<LinearProgress*/}
          {/*  color='neutral'*/}
          {/*  value={fileProgressNumber}*/}
          {/*  size={'lg'}*/}
          {/*  determinate*/}
          {/*  sx={[*/}
          {/*    {*/}
          {/*      ...(fileProgressNumber < 100 && {*/}
          {/*        color: 'var(--joy-palette-success-solidBg)',*/}
          {/*      }),*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
          <Typography>{fileProgressNumber}%</Typography>
        </FlexRow>
        <DropZone
          handleFileList={handleFileList}
          dropCautionContent={<Typography>개별파일 5MB, 총합 10MB 까지 업로드 가능</Typography>}
        />
        <AnimatePresence>
          {files.map((file, index) => {
            const { sizeInKB, sizeInMB, isUnder1MB } = fileSizeFormatter(file.file.size);

            const fileSize = !isUnder1MB ? sizeInMB.toFixed(2) : sizeInKB.toFixed(2);
            const fileProgressNumber = Math.round((Number(sizeInMB) / 5) * 100);

            return (
              <FlexRow
                as={motion.div}
                key={`${fileId}_${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => deleteFile(file)}
              >
                <Typography>fileSize: {fileSize}</Typography>
                <Typography>fileProgressNumber: {fileProgressNumber}</Typography>
                <Typography>fileName: {file.file.name}</Typography>
                {/*<FileUploadItem*/}
                {/*  icon={<InsertDriveFileRoundedIcon />}*/}
                {/*  fileName={file.originalFileName || file.fileName}*/}
                {/*  fileSize={`${fileSize} ${isUnder1MB ? 'KB' : 'MB'}`}*/}
                {/*  progress={fileProgressNumber}*/}
                {/*  deleteFile={() => deleteFile(file)}*/}
                {/*/>*/}
              </FlexRow>
            );
          })}
        </AnimatePresence>
      </FlexColumn>
    </FlexColumn>
  );
}
