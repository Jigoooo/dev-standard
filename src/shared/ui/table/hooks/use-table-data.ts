import { useState } from 'react';

import { TDataWithIndex } from '@/shared/ui';

export function useTableData<TData extends TDataWithIndex>(tableDataList: TData[]) {
  const [dataList, setDataList] = useState(tableDataList);

  const handelDataList = (dataIndex: number, key: string, value: any) => {
    setDataList((prevState) => {
      return prevState.map((item) => {
        if (item.index === dataIndex) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
    });
  };

  const deleteDataList = (dataIndex: number) => {
    setDataList((prevState) => {
      return prevState.filter((item) => item.index !== dataIndex);
    });
  };

  return { dataList, setDataList, handelDataList, deleteDataList };
}
