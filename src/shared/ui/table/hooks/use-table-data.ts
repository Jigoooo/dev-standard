import { useEffect, useState } from 'react';

import { TDataWithIndex } from '@/shared/ui';

export function useTableData<TData extends TDataWithIndex>(tableDataList: TData[]) {
  const [dataList, setDataList] = useState(tableDataList);

  useEffect(() => {
    setDataList(tableDataList);
  }, [tableDataList]);

  const handelDataList = (index: string, key: string, value: any) => {
    setDataList((prevState) => {
      return prevState.map((item) => {
        if (item.index === index) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
    });
  };

  const deleteDataList = (index: string) => {
    setDataList((prevState) => {
      return prevState.filter((item) => item.index !== index);
    });
  };

  return { dataList, setDataList, handelDataList, deleteDataList };
}
