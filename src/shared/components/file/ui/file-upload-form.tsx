import { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';

import { DropZone } from './drop-zone.tsx';
import { fileSizeFormatter, resizeImage } from '@/shared/lib';
import { FlexColumn, FlexRow, Typography, TFile } from '@/shared/components';

export function FileUploadForm({
  files,
  handleFiles,
  fileDelete,
}: {
  files: TFile[];
  handleFiles: (file: TFile) => void;
  fileDelete: (fileUUID: string) => void;
}) {
  const fileId = useId();

  const [innerFiles, setInnerFiles] = useState<TFile[]>([]);
  useEffect(() => {
    setInnerFiles(files);
  }, [files]);

  const totalFileSize = useMemo(() => {
    return innerFiles.reduce((acc, cur) => {
      const { sizeInMB } = fileSizeFormatter(cur.file.size);

      return acc + Number(sizeInMB);
    }, 0);
  }, [innerFiles]);

  const fileProgressNumber = useMemo(() => {
    return Math.round((Number(totalFileSize) / 10) * 100);
  }, [totalFileSize]);

  const handleInnerFiles = async (file: File) => {
    const compressedFile = (await resizeImage({ file })) as File;
    const newFile: TFile = {
      fileUUID: uuidV4(),
      file: compressedFile,
    };

    handleFiles(newFile);

    setInnerFiles((state) => [...state, newFile]);
  };

  const deleteFile = (file: TFile) => {
    setInnerFiles((state) => state.filter((item) => item.fileUUID !== file.fileUUID));
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
          handleFileList={handleInnerFiles}
          dropCautionContent={<Typography>개별파일 5MB, 총합 10MB 까지 업로드 가능</Typography>}
        />
        <AnimatePresence>
          {innerFiles.map((file, index) => {
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
                <Typography>fileSize: {`${fileSize} ${isUnder1MB ? 'KB' : 'MB'}`}</Typography>
                <Typography>fileProgressNumber: {fileProgressNumber}</Typography>
                <Typography>fileName: {file.file.name}</Typography>
              </FlexRow>
            );
          })}
        </AnimatePresence>
      </FlexColumn>
    </FlexColumn>
  );
}
