import React, { ReactNode, useRef, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import Card, { CardProps } from '@mui/joy/Card';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

import { isExtensionNotAllowed } from '@/shared/lib';
import { showNotification } from '@/shared/components/snack-bar';
import { colors } from '@/shared/constants';

export function DropZone({
  icon,
  sx,
  handleFileList,
  dropCautionContent,
  ...other
}: CardProps & {
  icon?: React.ReactElement;
  handleFileList: (file: File) => void;
  dropCautionContent?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);

  const fileHandler = async (file: File) => {
    if (isExtensionNotAllowed(file.name)) {
      showNotification({ message: '허용되지 않는 파일이에요', color: 'danger' });
      return;
    }

    setFileUploadLoading(true);
    handleFileList(file);
    setFileUploadLoading(false);
  };

  const fileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files?.[0]) return;

    await fileHandler(event.target?.files?.[0]);
    event.target.value = '';
  };

  const [dragOver, setDragOver] = useState<boolean>(false);
  const relatedTargetRef = useRef<HTMLElement | null>(null);

  const fileDropChange = async (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (!event.dataTransfer?.files?.[0]) return;

    await fileHandler(event.dataTransfer?.files?.[0]);
  };

  const setEnterDragWithBoundary = (event: React.DragEvent<HTMLDivElement>, value: boolean) => {
    const relatedTarget =
      event.relatedTarget ||
      (value ? relatedTargetRef.current : window.document.elementFromPoint(event.clientX, event.clientY));

    if (relatedTarget instanceof HTMLElement && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    relatedTargetRef.current = null;
    setDragOver(value);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Card
      component={'label'}
      variant='soft'
      {...other}
      sx={[
        {
          boxSizing: 'border-box',
          borderRadius: 'sm',
          border: dragOver ? `3px dashed ${colors.primary[500]}` : '3px dashed #bbbbbb',
          transition: '0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          flexGrow: 1,
          boxShadow: 'none',
          minHeight: 115,
          backgroundColor: dragOver ? colors.primary[100] : undefined,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onDrop={fileDropChange}
      onDragEnter={(event: React.DragEvent<HTMLDivElement>) => setEnterDragWithBoundary(event, true)}
      onDragLeave={(event: React.DragEvent<HTMLDivElement>) => {
        if (event.target instanceof HTMLElement) {
          relatedTargetRef.current = event.target;
        }
        setEnterDragWithBoundary(event, false);
      }}
      onDragOver={handleDragOver}
    >
      {!fileUploadLoading ? (
        <>
          <AspectRatio
            ratio='1'
            variant='solid'
            color='primary'
            sx={{
              minWidth: 32,
              borderRadius: '50%',
              '--Icon-fontSize': '16px',
            }}
          >
            <div>{icon ?? <FileUploadRoundedIcon />}</div>
          </AspectRatio>
          <Typography level='body-sm' textAlign='center'>
            <Link component='button' overlay onClick={() => inputRef.current && inputRef.current.click()}>
              클릭 또는 드래그하여 파일 업로드
            </Link>
            <br />
            {dropCautionContent && dropCautionContent}
          </Typography>
        </>
      ) : (
        <CircularProgress />
      )}
      <input ref={inputRef} type={'file'} style={{ display: 'none' }} onChange={fileInputChange} />
    </Card>
  );
}
