import { useEffect } from 'react';

import { FiSearch } from 'react-icons/fi';

import { FlexRow, Input, SearchButton, Table, TDataWithIndexCheck, useTableData } from 'shared/ui';
import { generateUsers } from '@/entities/grid-example/config/test-data.ts';
import { RGridExample, useGridExampleHeaders } from '@/entities/grid-example';

export function GridExample() {
  // const [searchParams, setSearchParams] = useState<{
  //   name: string;
  // }>({
  //   name: '',
  // });

  const { gridExampleHeaderGroups, gridExampleHeaders } = useGridExampleHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    TDataWithIndexCheck & RGridExample
  >([]);

  // const handelSearchParams = (key: string, value: string) => {
  //   setSearchParams((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  // const filteredDataList = dataList.filter((item) => {
  //   if (searchParams.name) {
  //     return item.name.toLowerCase().includes(searchParams.name.toLowerCase());
  //   }
  //   return true;
  // });

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      const allUsers = [];

      for await (const batch of generateUsers({
        total: 10000,
      })) {
        allUsers.push(...batch);

        if (isMounted) {
          setDataList((prev) => [...prev, ...batch]);
        }
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 180px)',
        paddingTop: 12,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingBlock: 12,
          paddingRight: 14,
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Input
          startDecorator={<FiSearch style={{ color: '#999999', fontSize: '1.1rem' }} />}
          style={{ width: 400 }}
          placeholder={'이름'}
        />
        <SearchButton />
      </FlexRow>
      <Table
        tableHeaderGroups={gridExampleHeaderGroups}
        tableHeaders={gridExampleHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        deleteDataList={deleteDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </div>
  );
}
