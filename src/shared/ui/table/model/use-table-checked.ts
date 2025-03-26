import { useEffect, useState } from 'react';

export function useTableChecked<T extends Record<string, any>, K extends keyof T>({
  dataList,
  dataKey,
}: {
  dataList: T[];
  dataKey: K;
}) {
  const [checkList, setCheckList] = useState<T[K][]>([]);

  useEffect(() => {
    setCheckList([]);
  }, [dataList.length]);

  const isChecked = (data: T) => checkList.includes(data[dataKey]);

  const handleCheck = (data: T) => {
    if (checkList.includes(data[dataKey])) {
      setCheckList(checkList.filter((item) => item !== data[dataKey]));
    } else {
      setCheckList([...checkList, data[dataKey]]);
    }
  };

  const handleCheckAll = () => {
    if (checkList.length === dataList.length) {
      setCheckList([]);
    } else {
      setCheckList(
        dataList.map((item) => {
          return item[dataKey];
        }),
      );
    }
  };

  const checkedState = {
    isAllChecked: checkList.length === dataList.length,
    isPartiallyChecked: checkList.length > 0 && checkList.length < dataList.length,
  };

  const resetCheckList = () => {
    setCheckList([]);
  };

  return {
    isChecked,
    checkList,
    handleCheck,
    handleCheckAll,
    checkedState,
    resetCheckList,
  };
}
