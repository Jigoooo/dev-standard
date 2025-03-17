import { useState } from 'react';

import {
  Button,
  dialogActions,
  DialogType,
  FileUploadForm,
  FlexColumn,
  FlexRow,
  ModalLayout,
  TFile,
  THeader,
  useModal,
} from 'shared/ui';
import { isExtensionAllowed, readExcelFile } from '@/shared/lib';
import {
  ExcelEditModal,
  RExcelData,
  useRegisterExcelMutation,
} from '@/entities/excel-upload-download';

export function ExcelUploadModal() {
  const [files, setFiles] = useState<TFile[]>([]);
  const [excelDataList, setExcelDataList] = useState<RExcelData[]>([]);
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
  const excelEditModalOpen = ({ headers, rows }: { headers: THeader[]; rows: any[] }) => {
    excelEditModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 1200, height: 800 }}
          title={'엑셀 편집'}
          close={close}
        >
          <ExcelEditModal
            maxWidth={1200}
            headers={headers}
            rows={rows}
            close={(dataList) => {
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

    const headerWidths = [150, 150, 150, 80, 100, 100, 120, 100, 100];

    const rowHeaders: THeader[] = readData.rows[0].map((row, index): THeader => {
      const label = row.toString();

      return {
        id: index.toString(),
        label,
        width: headerWidths[index],
        pin: 'view',
        headerAlign: 'left',
        dataAlign: 'left',
        sorter: {
          sortable: false,
        },
        filter: {
          filterType: 'text',
          filterValue: '',
        },
      };
    });

    const rowHeadersWithIndex: THeader[] = [
      {
        id: 'index',
        label: '',
        width: 60,
        pin: 'left',
        headerAlign: 'left',
        dataAlign: 'right',
        sorter: {
          sortable: false,
        },
      },
      ...rowHeaders,
    ];

    const rows = readData.rows.slice(1).map((rows, rowIndex) => {
      return {
        index: (rowIndex + 1).toString(),
        ...Object.fromEntries(
          rows.map((row, index) => {
            return [index.toString(), row];
          }),
        ),
      };
    });

    excelEditModalOpen({
      headers: rowHeadersWithIndex,
      rows,
    });
  };

  const registerExcelMutation = useRegisterExcelMutation();
  const registerExcel = () => {
    console.log(excelDataList);

    // registerExcelMutation.mutate({
    //   excelNm: '',
    //   excelDataList,
    // });
  };

  return (
    <FlexRow style={{ height: '100%', padding: 12, overflow: 'hidden' }}>
      <FlexColumn style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: '80%' }}>
          <FileUploadForm
            accept={'.xls, .xlsx'}
            files={files}
            handleFiles={handleFiles}
            fileDelete={deleteFile}
            disabled={files.length > 0}
          />
        </div>
        {files.length > 0 && (
          <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <Button
              style={{ paddingInline: 18, backgroundColor: '#333333' }}
              onClick={editExcelFile}
            >
              분석
            </Button>
            <Button style={{ paddingInline: 18 }} onClick={registerExcel}>
              업로드
            </Button>
          </FlexRow>
        )}
      </FlexColumn>
    </FlexRow>
  );
}
