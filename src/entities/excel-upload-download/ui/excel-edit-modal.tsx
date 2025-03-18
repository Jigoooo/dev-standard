import {
  Button,
  FlexColumn,
  FlexRow,
  Input,
  Table,
  TDataWithIndex,
  THeader,
  useTableData,
} from '@/shared/ui';
import { useState } from 'react';

export function ExcelEditModal<TData extends TDataWithIndex>({
  excelNm,
  headers,
  rows,
  maxWidth,
  close,
}: {
  excelNm: string;
  headers: THeader[];
  rows: TData[];
  maxWidth: number;
  close: (excelNm: string, dataList: TData[]) => void;
}) {
  const [name, setName] = useState(excelNm);
  const { dataList, handelDataList } = useTableData<TData>(rows);

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
        editMode={true}
      />
      <FlexRow style={{ justifyContent: 'flex-end' }}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
        <Button style={{ width: 80 }} onClick={() => close(name, dataList)}>
          저장
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}
