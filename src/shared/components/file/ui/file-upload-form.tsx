import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';

import { DropZone } from './drop-zone.tsx';
import { fileSizeFormatter } from '@/shared/lib';
import {
  FlexColumn,
  FlexRow,
  Typography,
  TFile,
  LinearProgress,
  dialogActions,
  DialogType,
} from '@/shared/components';

export function FileUploadForm({
  files,
  handleFiles,
  fileDelete,
  multiple = false,
  limitMB = 0,
}: {
  files: TFile[];
  handleFiles: (file: TFile[]) => void;
  fileDelete: (fileUUID: string) => void;
  multiple?: boolean;
  limitMB?: number;
}) {
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

  const fileProgressFraction = useMemo(() => {
    return Math.min(totalFileSize / limitMB, 1);
  }, [limitMB, totalFileSize]);

  const handleInnerFiles = async (files: FileList) => {
    const newFiles = Array.from(files).map((file) => {
      return {
        fileUUID: uuidV4(),
        file,
      };
    });

    const totalSize = [...innerFiles, ...newFiles].reduce((sum, { file }) => sum + file.size, 0);
    if (totalSize / (1024 * 1024) <= limitMB && limitMB > 0) {
      handleFiles(newFiles);

      setInnerFiles((state) => [...state, ...newFiles]);
    } else {
      dialogActions.openDialog({
        dialogType: DialogType.WARNING,
        title: '업로드 용량이 초과되었습니다.',
        contents: `업로드 가능한 최대 용량은 ${limitMB}MB 입니다.`,
      });
    }
  };

  const deleteFile = (file: TFile) => {
    setInnerFiles((state) => state.filter((item) => item.fileUUID !== file.fileUUID));
    fileDelete(file.fileUUID);
  };

  return (
    <FlexColumn style={{ width: '100%', gap: 8 }}>
      {limitMB > 0 && (
        <FlexColumn style={{ gap: 2 }}>
          <Typography style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            최대 업로드 용량 ({limitMB}MB)
          </Typography>
          <LinearProgress progress={fileProgressFraction} height={10} progressColor='#007bff' />
        </FlexColumn>
      )}
      <DropZone multiple={multiple} handleFiles={handleInnerFiles} />
      <AnimatePresence>
        {innerFiles.map((file) => {
          const { sizeInKB, sizeInMB, isUnder1MB } = fileSizeFormatter(file.file.size);

          const fileSize = !isUnder1MB ? sizeInMB.toFixed(2) : sizeInKB.toFixed(2);
          const fileProgressNumber = Math.round((Number(sizeInMB) / 5) * 100);

          return (
            <FlexRow
              as={motion.div}
              key={file.fileUUID}
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
  );
}
