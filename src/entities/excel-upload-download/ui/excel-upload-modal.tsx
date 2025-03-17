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
} from '@/shared/ui';
import { isExtensionAllowed, readExcelFile } from '@/shared/lib';
import { ExcelEditModal, RExcelData, useSaveExcelMutation } from '@/entities/excel-upload-download';

const headerMappingObj = {
  orderNo: { index: 0, width: 150 },
  productCode: { index: 1, width: 150 },
  productName: { index: 2, width: 150 },
  quantity: { index: 3, width: 80 },
  price: { index: 4, width: 100 },
  totalAmount: { index: 5, width: 100 },
  orderDate: { index: 6, width: 120 },
  customerName: { index: 7, width: 100 },
  status: { index: 8, width: 100 },
} as const;

export function ExcelUploadModal() {
  const [files, setFiles] = useState<TFile[]>([]);
  const [excelNm, setExcelNm] = useState('');
  const [excelDataList, setExcelDataList] = useState<({ index: string } & RExcelData)[]>([]);
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

    console.log(readData);

    const [excelHeaders, ...excelRows] = readData.rows;

    const rowHeaders: THeader[] = excelHeaders.map((row, index): THeader => {
      const label = row.toString();

      const findHeader = Object.entries(headerMappingObj).find(
        ([, value]) => value.index === index,
      );

      const id = findHeader?.[0] as keyof typeof headerMappingObj;
      const width = findHeader?.[1].width as number;

      return {
        id,
        label,
        width,
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

    const rows = excelRows.map((rows, rowIndex) => {
      const entries = Object.fromEntries(
        rows.map((row, index) => {
          const findHeader = Object.entries(headerMappingObj).find(
            ([, value]) => value.index === index,
          );

          const id = findHeader?.[0] as keyof typeof headerMappingObj;

          return [id, row];
        }),
      ) as RExcelData;

      return {
        index: (rowIndex + 1).toString(),
        ...entries,
      };
    });

    if (rows.length === 0) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        title: '엑셀 데이터가 없습니다.',
        overlayClose: true,
      });
      return;
    }

    if (excelDataList.length === 0) {
      setExcelDataList(rows);
    }

    excelEditModalOpen({
      headers: rowHeadersWithIndex,
      rows: excelDataList.length > 0 ? excelDataList : rows,
    });
  };

  const registerExcelMutation = useSaveExcelMutation();
  const registerExcel = () => {
    const excelDataListWithoutIndex = excelDataList.map((row) => {
      const { index: _index, ...rest } = row;
      return rest;
    });

    registerExcelMutation.mutate({
      excelNm,
      excelDataList: excelDataListWithoutIndex,
    });
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
            {excelDataList.length > 0 && (
              <Button style={{ paddingInline: 18 }} onClick={registerExcel}>
                업로드
              </Button>
            )}
          </FlexRow>
        )}
      </FlexColumn>
    </FlexRow>
  );
}
