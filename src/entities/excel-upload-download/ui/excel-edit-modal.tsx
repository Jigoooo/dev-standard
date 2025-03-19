import {
  Button,
  FlexColumn,
  FlexRow,
  Input,
  Table,
  TDataWithIndex,
  THeader,
  Typography,
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
  headers: THeader<TData>[];
  rows: TData[];
  maxWidth: number;
  close: ({ excelNm, dataList }: { excelNm: string; dataList: TData[] }) => void;
}) {
  const [name, setName] = useState(excelNm);
  const { dataList, handelDataList, deleteDataList } = useTableData<TData>(rows);

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
        <Button
          style={{ width: 80 }}
          onClick={() => {
            //todo 검증 로직 구현
            close({
              excelNm: name,
              dataList,
            });
          }}
        >
          저장
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}
