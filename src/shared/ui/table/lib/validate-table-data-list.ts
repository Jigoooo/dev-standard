// export function validateTableDataList<T>(dataList: unknown[], keys: (keyof T)[]): dataList is T[] {
//   return dataList.every((item) =>
//     keys.every((key) => {
//       if (key === 'index' || key === 'check' || key === 'button') {
//         return true;
//       }
//
//       return Object.prototype.hasOwnProperty.call(item, key);
//     }),
//   );
// }

export function validateTableDataList<T>(
  dataList: unknown[],
  keys: (keyof T)[],
): {
  valid: boolean;
  message: string;
  missingInfo: {
    index: number;
    missing: (keyof T)[];
  }[];
} {
  const missingInfo: {
    index: number;
    missing: (keyof T)[];
  }[] = dataList
    .map((item, idx) => {
      const missing = keys.filter((key) => {
        if (key === 'index' || key === 'check' || key === 'button') return false;
        return !Object.prototype.hasOwnProperty.call(item, key);
      });
      return { index: idx, missing };
    })
    .filter((info) => info.missing.length > 0);

  if (missingInfo.length === 0) {
    return {
      valid: true,
      message: '모든 행이 필요한 키를 가지고 있습니다.',
      missingInfo: [],
    };
  } else {
    const message = missingInfo
      .map((info) => `행 ${info.index + 1}: [${info.missing.join(', ')}] 키가 누락됨`)
      .join('; ');
    return {
      valid: false,
      message,
      missingInfo,
    };
  }
}
