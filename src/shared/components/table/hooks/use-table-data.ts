import { useState } from 'react';

export function useTableData<TData extends { index: string }>(tableDataList: TData[]) {
  const [dataList, setDataList] = useState(tableDataList);

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

  return { dataList, handelDataList };
}
