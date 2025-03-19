import { useState } from 'react';

import { RiFileExcel2Line } from 'react-icons/ri';

import {
  Button,
  dialogActions,
  DialogType,
  FileUploadForm,
  FlexColumn,
  FlexRow,
  Link,
  ModalLayout,
  TDataWithIndex,
  TFile,
  THeader,
  TValidationRuleWithHeaderId,
  useModal,
} from '@/shared/ui';
import { isExtensionAllowed, readExcelFile } from '@/shared/lib';
import { ExcelEditModal } from './excel-edit-modal.tsx';
import { RData } from '../model/excel-type.ts';

export function ExcelUploadModal<TData extends TDataWithIndex>({
  headers,
  validationRules,
  close,
  registerExcel,
  excelFormFileLink,
}: {
  headers: THeader<TData>[];
  validationRules?: TValidationRuleWithHeaderId<TData>[];
  close: () => void;
  registerExcel: (excelNm: string, excelDataList: TData[], close: () => void) => void;
  excelFormFileLink?: string;
}) {
  const [files, setFiles] = useState<TFile[]>([]);
  const [excelNm, setExcelNm] = useState('');
  const [excelDataList, setExcelDataList] = useState<TData[]>([]);
  const handleFiles = async (files: TFile[]) => {
    if (
      !isExtensionAllowed({
        extensions: ['.xls', '.xlsx'],
        fileName: files[0].file.name,
      })
    ) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '업로드 실패',
        contents: '허용되지 않는 파일이에요',
      });

      return;
    }

    setFiles(files);
  };
  const deleteFile = (fileUUID: string) => {
    setFiles((prevState) => {
      return prevState.filter((file) => file.fileUUID !== fileUUID);
    });
  };

  const excelEditModal = useModal();
  const excelEditModalOpen = ({ excelNm, rows }: { excelNm: string; rows: TData[] }) => {
    excelEditModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 1200, height: 800 }}
          title={'엑셀 편집'}
          close={close}
        >
          <ExcelEditModal
            excelNm={excelNm}
            headers={headers}
            validationRules={validationRules}
            rows={rows}
            maxWidth={1200}
            close={({ excelNm, dataList }) => {
              setExcelNm(excelNm);
              setExcelDataList(dataList);
              close();
            }}
          />
        </ModalLayout>
      );
    });
  };

  const editExcelFile = async () => {
    if (files.length === 0) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '편집 대상 파일이 없습니다.',
        overlayClose: true,
      });

      return;
    }

    try {
      const readData = await readExcelFile({
        file: files[0].file,
        options: {
          header: 1,
        },
      });

      if (readData.rows.length === 0) {
        dialogActions.open({
          dialogType: DialogType.ERROR,
          title: '파일을 읽을 수 없습니다.',
          overlayClose: true,
        });
        return;
      }

      const excelRows = readData.rows.slice(1);

      const rows = excelRows.map((row, rowIndex) => {
        const filteredHeaders = headers.filter(
          (header) => !['index', 'check', 'button'].includes(header.id),
        );
        const entries = Object.fromEntries(
          filteredHeaders.map((header) => {
            const headerIndex = filteredHeaders.findIndex((h) => h.id === header.id);
            return [header.id, row[headerIndex]];
          }),
        ) as RData<TData>;

        return {
          index: rowIndex + 1,
          ...entries,
        };
      }) as TData[];

      if (rows.length === 0) {
        dialogActions.open({
          dialogType: DialogType.ERROR,
          title: '엑셀 데이터가 없습니다.',
          overlayClose: true,
        });
        return;
      }

      const fileNameWithoutExtension = files[0].file.name.split('.').slice(0, -1).join('.');

      excelEditModalOpen({
        excelNm: excelNm || fileNameWithoutExtension,
        rows: excelDataList.length > 0 ? excelDataList : rows,
      });
    } catch {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '읽을 수 없는 파일입니다.',
        contents: '파일 손상여부를 확인해 주세요.',
        overlayClose: true,
      });
    }
  };

  return (
    <FlexRow style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FlexColumn style={{ width: '100%', justifyContent: 'space-between' }}>
        <FlexColumn style={{ width: '100%', height: '80%', gap: 14 }}>
          {excelFormFileLink && (
            <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <RiFileExcel2Line />
              <Link
                href={excelFormFileLink}
                download
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
              >
                업로드 양식
              </Link>
            </FlexRow>
          )}

          <FileUploadForm
            accept={'.xls, .xlsx'}
            files={files}
            handleFiles={handleFiles}
            fileDelete={deleteFile}
            disabled={files.length > 0}
          />
        </FlexColumn>
        {files.length > 0 ? (
          <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <Button
              style={{ paddingInline: 18, backgroundColor: '#333333' }}
              onClick={editExcelFile}
            >
              분석
            </Button>
            {excelDataList.length > 0 && (
              <Button
                style={{ paddingInline: 18 }}
                onClick={() => registerExcel(excelNm, excelDataList, close)}
              >
                업로드
              </Button>
            )}
          </FlexRow>
        ) : (
          <div />
        )}
      </FlexColumn>
    </FlexRow>
  );
}
