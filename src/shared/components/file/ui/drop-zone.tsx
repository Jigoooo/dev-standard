import React, { ReactNode, useRef, useState } from 'react';

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

import { isExtensionNotAllowed } from '@/shared/lib';
import { colors } from '@/shared/constants';
import { dialogActions, DialogType, FlexRow, Link, Typography } from '@/shared/components';

export function DropZone({
  handleFileList,
  dropCautionContent,
}: {
  handleFileList: (file: File) => void;
  dropCautionContent?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileHandler = async (file: File) => {
    if (isExtensionNotAllowed(file.name)) {
      dialogActions.openDialog({
        dialogType: DialogType.ERROR,
        title: '업로드 실패',
        contents: '허용되지 않는 파일이에요',
      });

      return;
    }

    handleFileList(file);
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
      (value
        ? relatedTargetRef.current
        : window.document.elementFromPoint(event.clientX, event.clientY));

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
    <FlexRow
      style={{
        ...{
          boxSizing: 'border-box',
          borderRadius: 8,
          border: dragOver ? `3px dashed ${colors.primary[500]}` : '3px dashed #bbbbbb',
          transition: '0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 36,
          paddingBlock: 18,
          flexGrow: 1,
          boxShadow: 'none',
          minHeight: 115,
          backgroundColor: dragOver ? colors.primary[100] : undefined,
        },
      }}
      onDrop={fileDropChange}
      onDragEnter={(event: React.DragEvent<HTMLDivElement>) =>
        setEnterDragWithBoundary(event, true)
      }
      onDragLeave={(event: React.DragEvent<HTMLDivElement>) => {
        if (event.target instanceof HTMLElement) {
          relatedTargetRef.current = event.target;
        }
        setEnterDragWithBoundary(event, false);
      }}
      onDragOver={handleDragOver}
    >
      <>
        <FlexRow
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            borderRadius: '50%',
            backgroundColor: '#dddddd',
          }}
        >
          <FileUploadRoundedIcon />
        </FlexRow>
        <Typography>
          <Link onClick={() => inputRef.current && inputRef.current.click()}>
            클릭 또는 드래그하여 파일 업로드
          </Link>
          <br />
          {dropCautionContent && dropCautionContent}
        </Typography>
      </>
      <input ref={inputRef} type={'file'} style={{ display: 'none' }} onChange={fileInputChange} />
    </FlexRow>
  );
}
