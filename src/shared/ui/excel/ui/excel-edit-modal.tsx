import { useState } from 'react';

import {
  dialogActions,
  ExcelExportButton,
  FlexColumn,
  FlexRow,
  Input,
  SaveButton,
  Table,
  TDataWithIndex,
  THeader,
  TValidationRuleWithHeaderId,
  Typography,
  useTableData,
  writeExcelFile,
} from '@/shared/ui';

export function ExcelEditModal<TData extends TDataWithIndex>({
  excelNm,
  headers,
  validationRules,
  rows,
  maxWidth,
  close,
}: {
  excelNm: string;
  headers: THeader<TData>[];
  validationRules?: TValidationRuleWithHeaderId<TData>[];
  rows: TData[];
  maxWidth: number;
  close: ({ excelNm, dataList }: { excelNm: string; dataList: TData[] }) => void;
}) {
  const [name, setName] = useState(excelNm);
  const { dataList, handelDataList, deleteDataList } = useTableData<TData>(rows);

  const saveExcel = () => {
    const problematicResults = headers.flatMap((header) => {
      if (!validationRules) {
        return [];
      }

      const rule = validationRules.find((r) => r.id === header.id);
      if (!rule) {
        return [];
      }

      return dataList
        .map((data, rowIndex) => {
          const value = data[header.id as keyof TData] as string | number | null;
          const result = rule.validateFn(value);
          if (!result.isValid) {
            return {
              headerId: header.id,
              headerLabel: header.label,
              rowIndex: rowIndex + 1,
              value,
              errorMessage: result.errorMessage,
            };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    });

    if (problematicResults.length > 0) {
      const errorMessages = problematicResults.map(
        (result) => `${result.headerLabel} (${result.rowIndex}행): ${result.errorMessage}\n`,
      );
      dialogActions.open({
        title: '엑셀 유효성 검사 결과',
        contents: (
          <Typography
            style={{ fontSize: '0.9rem', fontWeight: 400, paddingRight: 12, lineHeight: 2 }}
          >
            {errorMessages}
          </Typography>
        ),
        overlayClose: true,
      });
      return;
    }

    close({
      excelNm: name,
      dataList,
    });
  };

  const exportExcelFile = () => {
    const aoaTestRows = [
      ['주문번호', '상품코드', '상품명', '수량', '단가', '가격', '주문일자', '주문자', '상태'],
      ['test', 1],
      ['test2', 2],
    ];

    writeExcelFile({
      excelFileName: 'test file',
      sheetName: 'test sheet1',
      rows: aoaTestRows,
      rowDataType: 'array',
    });
  };

  return (
    <FlexColumn style={{ width: '100%', maxWidth, height: '100%', gap: 12 }}>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: true,
        }}
        tableHeaders={headers}
        tableDataList={dataList}
        handelDataList={handelDataList}
        deleteDataList={deleteDataList}
        editMode={true}
      />
      <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <FlexRow style={{ alignItems: 'center', gap: 4 }}>
          <Typography style={{ fontSize: '0.9rem' }}>엑셀명: </Typography>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </FlexRow>
        <SaveButton onClick={saveExcel} />
        <ExcelExportButton onClick={exportExcelFile} />
      </FlexRow>
    </FlexColumn>
  );
}
