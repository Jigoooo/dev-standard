export function validateTableDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
  return dataList.every((item) =>
    keys.every((key) => {
      if (key === 'index' || key === 'check' || key === 'button') {
        return true;
      }

      return Object.prototype.hasOwnProperty.call(item, key);
    }),
  );
}
