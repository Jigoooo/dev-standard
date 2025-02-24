import { useEffect, useId, useMemo, useState } from 'react';
import { Card, Box, Typography, Divider, Stack } from '@mui/joy';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import LinearProgress from '@mui/joy/LinearProgress';
import { motion, AnimatePresence } from 'framer-motion';

import { FileUploadItem } from './file-upload-item.tsx';
import { DropZone } from './drop-zone.tsx';
import { fileSizeFormatter, resizeImage } from '@/shared/lib';

export function FileUploadForm({
  attachments,
  fileHandlerService,
  fileDelete,
}: {
  attachments: any[];
  fileHandlerService: (file: File) => Promise<{ path: string; idx: number }>;
  fileDelete: (fileIdx: number) => void;
}) {
  const fileId = useId();

  const [fileList, setFileList] = useState<any[]>([]);
  useEffect(() => {
    setFileList(attachments);
  }, [attachments]);

  const totalFileSize = useMemo(() => {
    return fileList.reduce((acc, cur) => {
      const { sizeInMB } = fileSizeFormatter(cur.fileSize);

      return acc + Number(sizeInMB);
    }, 0);
  }, [fileList]);

  const fileProgressNumber = useMemo(() => {
    return Math.round((Number(totalFileSize) / 10) * 100);
  }, [totalFileSize]);

  const handleFileList = async (file: File) => {
    const compressedFile = (await resizeImage({ file })) as File;
    fileHandlerService(compressedFile);

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

    const fileObj = {
      fileName: compressedFile.name,
      fileSize: compressedFile.size,
      path: '',
      idx: -1,
      postIdx: -1,
    };

    setFileList((state) => [...state, fileObj]);
  };

  const deleteFile = (file: any) => {
    setFileList((state) => state.filter((item) => item.idx !== file.idx));
    fileDelete(file.idx);
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level='title-md'>첨부파일</Typography>
      </Box>
      <Divider />
      <Stack spacing={2} sx={{ my: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontSize='small' fontWeight={'bold'}>
            최대 업로드 용량
          </Typography>
          <LinearProgress
            color='neutral'
            value={fileProgressNumber}
            size={'lg'}
            determinate
            sx={[
              {
                ...(fileProgressNumber < 100 && {
                  color: 'var(--joy-palette-success-solidBg)',
                }),
              },
            ]}
          />
          <Typography fontSize='xs'>{fileProgressNumber}%</Typography>
        </Box>
        <DropZone
          handleFileList={handleFileList}
          dropCautionContent={<Typography>개별파일 5MB, 총합 10MB 까지 업로드 가능</Typography>}
        />
        <AnimatePresence>
          {fileList.map((file, index) => {
            const { sizeInKB, sizeInMB, isUnder1MB } = fileSizeFormatter(file.fileSize);

            const fileSize = !isUnder1MB ? sizeInMB.toFixed(2) : sizeInKB.toFixed(2);
            const fileProgressNumber = Math.round((Number(sizeInMB) / 5) * 100);

            return (
              <motion.div
                key={`${fileId}_${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FileUploadItem
                  icon={<InsertDriveFileRoundedIcon />}
                  fileName={file.originalFileName || file.fileName}
                  fileSize={`${fileSize} ${isUnder1MB ? 'KB' : 'MB'}`}
                  progress={fileProgressNumber}
                  deleteFile={() => deleteFile(file)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Stack sx={{ pt: 6, gap: 1 }}>
          <Typography level={'body-sm'} color={'danger'}>
            &#8251; 다음 파일들은 랜섬웨어 공격루트로 활용될 수 있어 업로드 및 다운로드가 불가합니다.
          </Typography>
          <Typography level={'body-sm'} color={'danger'} fontWeight={'bold'}>
            ace, ade, adp, asp, aspx, bat, chm, cmd, com, cpl, crt, exe, gz, hlp, hta, htm,
            <br />
            html, in, inf, mdb, mde, msc, msi, ink, ins, isp, js, jse, jsp, lnk, msp, mst, pcd, php,
            <br />
            php3, php4, phps, pi, pif, reg, scr, sct, shs, url, vb, vbe, vbs, wsc, wsf, wsh, xml
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
