import React, { useRef, useState } from 'react';

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

import { colors } from '@/shared/constants';
import { FlexRow, Link } from '@/shared/components';

export function DropZone({
  multiple,
  handleFiles,
}: {
  multiple: boolean;
  handleFiles: (file: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files?.[0]) return;

    handleFiles(event.target?.files);
    event.target.value = '';
  };

  const [dragOver, setDragOver] = useState<boolean>(false);
  const relatedTargetRef = useRef<HTMLElement | null>(null);

  const fileDropChange = async (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (!event.dataTransfer?.files?.[0]) return;

    handleFiles(event.dataTransfer?.files);
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
          border: dragOver ? `3px dashed ${colors.primary[400]}` : '3px dashed #bbbbbb',
          transition: '0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 36,
          paddingBlock: 12,
          flexGrow: 1,
          boxShadow: 'none',
          minHeight: 130,
          height: 130,
          maxHeight: 130,
          backgroundColor: dragOver ? colors.primary[50] : undefined,
          cursor: 'pointer',
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
      onClick={() => inputRef.current && inputRef.current.click()}
    >
      <>
        <FlexRow
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: dragOver ? colors.primary[100] : '#eeeeee',
            transition: '0.2s',
          }}
        >
          <FileUploadRoundedIcon />
        </FlexRow>
        <Link style={{ fontWeight: 500, fontSize: '0.9rem' }}>
          클릭 또는 드래그하여 파일 업로드
        </Link>
      </>
      <input
        ref={inputRef}
        type={'file'}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={fileInputChange}
      />
    </FlexRow>
  );
}
