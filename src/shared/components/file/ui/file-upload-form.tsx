import { useEffect, useMemo, useState, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import { IconType } from 'react-icons';

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileImage,
  FaFileArchive,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
} from 'react-icons/fa';

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
          const fileName = file.file.name;
          const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
          const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase?.();
          const fileExtensionWithDot = fileName.split('.').pop()?.toUpperCase?.();

          return (
            <FlexRow
              as={motion.div}
              key={file.fileUUID}
              style={{
                height: 60,
                paddingInline: 12,
                paddingBlock: 8,
                border: '1px solid #d1d1d1',
                borderRadius: 6,
                gap: 10,
                alignItems: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => deleteFile(file)}
            >
              {getFileIcon(fileExtension)}
              <FlexColumn>
                <Typography style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {fileNameWithoutExtension}
                </Typography>
                <FlexRow style={{ alignItems: 'center', gap: 4 }}>
                  <Typography style={{ fontWeight: 500, fontSize: '0.82rem', color: '#777777' }}>
                    {fileExtensionWithDot}
                  </Typography>
                  <Typography style={{ color: '#777777' }}>&middot;</Typography>
                  <Typography style={{ fontWeight: 500, fontSize: '0.82rem', color: '#777777' }}>
                    {`${fileSize} ${isUnder1MB ? 'KB' : 'MB'}`}
                  </Typography>
                </FlexRow>
              </FlexColumn>
            </FlexRow>
          );
        })}
      </AnimatePresence>
    </FlexColumn>
  );
}

const fileIconMap: { [extension: string]: IconType } = {
  // 이미지
  '.png': FaFileImage,
  '.jpg': FaFileImage,
  '.jpeg': FaFileImage,
  '.gif': FaFileImage,
  '.bmp': FaFileImage,
  '.tiff': FaFileImage,
  '.ico': FaFileImage,
  '.svg': FaFileImage,
  // 문서
  '.pdf': FaFilePdf,
  '.doc': FaFileWord,
  '.docx': FaFileWord,
  '.txt': FaFileAlt,
  '.rtf': FaFileAlt,
  '.odt': FaFileAlt,
  // 스프레드시트
  '.xls': FaFileExcel,
  '.xlsx': FaFileExcel,
  '.csv': FaFileExcel,
  '.ods': FaFileExcel,
  // 프레젠테이션
  '.ppt': FaFilePowerpoint,
  '.pptx': FaFilePowerpoint,
  '.odp': FaFilePowerpoint,
  // 압축 파일
  '.zip': FaFileArchive,
  '.rar': FaFileArchive,
  '.7z': FaFileArchive,
  '.tar': FaFileArchive,
  '.gz': FaFileArchive,
  '.bz2': FaFileArchive,
  // 비디오
  '.mp4': FaFileVideo,
  '.avi': FaFileVideo,
  '.mov': FaFileVideo,
  '.mkv': FaFileVideo,
  '.wmv': FaFileVideo,
  '.flv': FaFileVideo,
  // 오디오
  '.mp3': FaFileAudio,
  '.wav': FaFileAudio,
  '.ogg': FaFileAudio,
  '.m4a': FaFileAudio,
  '.flac': FaFileAudio,
  // 코드
  '.html': FaFileCode,
  '.css': FaFileCode,
  '.js': FaFileCode,
  '.jsx': FaFileCode,
  '.ts': FaFileCode,
  '.tsx': FaFileCode,
  '.json': FaFileCode,
  '.xml': FaFileCode,
  '.py': FaFileCode,
  '.java': FaFileCode,
  '.c': FaFileCode,
  '.cpp': FaFileCode,
  '.cs': FaFileCode,
  '.php': FaFileCode,
};

export function getFileIcon(extension: string): JSX.Element {
  const ext = extension.toLowerCase();
  const IconComponent = fileIconMap[ext] || FaFileAlt;
  return <IconComponent style={{ fontSize: '1.6rem', color: '#888888' }} />;
}
