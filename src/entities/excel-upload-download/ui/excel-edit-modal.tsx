import { FlexRow, Table, THeader, useTableData } from '@/shared/ui';

export function ExcelEditModal<TData>({
  maxWidth,
  headers,
  rows,
}: {
  maxWidth: number;
  headers: THeader[];
  rows: TData[];
}) {
  const { dataList, handelDataList } = useTableData<any>(rows);

  return (
    <FlexRow style={{ width: '100%', maxWidth, height: '100%' }}>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: false,
        }}
        tableHeaders={headers}
        tableDataList={dataList}
        handelDataList={handelDataList}
        editMode={true}
      />
    </FlexRow>
  );
}
