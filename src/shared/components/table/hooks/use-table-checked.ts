import { useState } from 'react';

export function useTableChecked<T>({ dataList, keyLabel }: { dataList: T[]; keyLabel: keyof T }) {
  const [checkList, setCheckList] = useState<(string | number)[]>([]);

  const handleCheck = (key: string | number) => {
    if (checkList.includes(key)) {
      setCheckList(checkList.filter((item) => item !== key));
    } else {
      setCheckList([...checkList, key]);
    }
  };

  const handleCheckAll = () => {
    if (checkList.length === dataList.length) {
      setCheckList([]);
    } else {
      setCheckList(
        dataList.map((item) => {
          return String(item[keyLabel]);
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
    checkList,
    handleCheck,
    handleCheckAll,
    checkedState,
    resetCheckList,
  };
}
