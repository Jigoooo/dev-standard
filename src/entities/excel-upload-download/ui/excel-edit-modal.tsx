import { Button, FlexColumn, FlexRow, Table, THeader, useTableData } from '@/shared/ui';

export function ExcelEditModal<TData>({
  maxWidth,
  headers,
  rows,
  close,
}: {
  maxWidth: number;
  headers: THeader[];
  rows: TData[];
  close: (dataList: TData[]) => void;
}) {
  const { dataList, handelDataList } = useTableData<any>(rows);

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
        <Button style={{ width: 80 }} onClick={() => close(dataList)}>
          저장
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}
