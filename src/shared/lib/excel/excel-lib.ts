import XLSX, { BookType } from 'xlsx-js-style';
import { saveAs } from 'file-saver';

import { detectDeviceTypeAndOS } from '@/shared/lib/common';
import { convertBlobToBase64 } from '@/shared/lib/file';
import { sendPostMessage } from '@/shared/lib/webView';

export function createWorkSheet({
  header,
  body,
  maxColumnBodyIndex,
}: {
  header: any[];
  body: any[][];
  maxColumnBodyIndex: number;
}) {
  const workSheet = XLSX.utils.aoa_to_sheet([header, ...body]);
  workSheet['!cols'] = fitToColumn(body[maxColumnBodyIndex]);

  return workSheet;
}

export function createWorkBook(workSheets: { sheetName: string; sheet: XLSX.WorkSheet }[]) {
  const sheets: { [key: string]: XLSX.WorkSheet } = {};
  const sheetNames: string[] = [];

  for (const sheet of workSheets) {
    sheets[sheet.sheetName] = sheet.sheet;
    sheetNames.push(sheet.sheetName);
  }

  return {
    Sheets: sheets,
    SheetNames: sheetNames,
  };
}

export function downloadExcel({
  workBook,
  excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  excelFileName = 'excel',
  excelFileExtension = 'xlsx',
}: {
  workBook: any;
  excelFileType?: string;
  excelFileName?: string;
  excelFileExtension?: BookType;
}) {
  const excelBuffer = XLSX.write(workBook, { bookType: excelFileExtension, type: 'array' });
  const excelFile = new Blob([excelBuffer], { type: excelFileType });
  const fileName = `${excelFileName}.${excelFileExtension}`;

  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    convertBlobToBase64(excelFile).then((base64String: string) => {
      sendPostMessage({ type: 'fileDownload', payload: { base64String, fileName: excelFileName } });
    });
  } else {
    saveAs(excelFile, fileName);
  }
}

export function fitToColumn(targetRow: any[]) {
  return targetRow.map((cell: any) => {
    let width = cell?.width;

    if (!width) {
      const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ가-힣]/.test(cell.v);
      const isSingleDigitNumber = cell.v.length === 1 && /[0-9]/.test(cell.v);
      const multiplier = isSingleDigitNumber ? 2 : isKorean ? 4 : 2;
      const cellLength = cell.v.length === 0 ? 100 : cell.v.length;

      width = cellLength * multiplier;
    }

    return { width };
  });
}
