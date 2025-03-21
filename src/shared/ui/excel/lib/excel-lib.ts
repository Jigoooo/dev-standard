import XLSX, { BookType, Sheet2JSONOpts } from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { WriteExcelFileParams } from '../model/excel-type';

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

  saveAs(excelFile, fileName);

  // const { isMobile } = detectDeviceTypeAndOS();
  //
  // if (isMobile) {
  //   convertBlobToBase64(excelFile).then((base64String: string) => {
  //     sendPostMessage({ type: 'fileDownload', payload: { base64String, fileName: excelFileName } });
  //   });
  // } else {
  //   saveAs(excelFile, fileName);
  // }
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

export async function readExcelFile({
  file,
  sheetIndex = 0,
  sheetName,
  options,
}: {
  file: File;
  sheetIndex?: number;
  sheetName?: string;
  options?: Sheet2JSONOpts;
}) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const findSheetNameByIndex = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName ?? findSheetNameByIndex];
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    ...options,
  });

  return {
    workbook,
    sheet,
    rows,
  };
}

function createWorksheetFromJson<T>(
  rows: T[],
  jsonToSheetOptions?: XLSX.JSON2SheetOpts,
): XLSX.WorkSheet {
  return XLSX.utils.json_to_sheet(rows, jsonToSheetOptions);
}

function createWorksheetFromArray<T>(
  rows: T[],
  aoaToSheetOptions?: XLSX.AOA2SheetOpts,
): XLSX.WorkSheet {
  if (!Array.isArray(rows) || !Array.isArray(rows[0])) {
    throw new Error('For array type, rows must be an array of arrays.');
  }
  return XLSX.utils.aoa_to_sheet(rows as any[][], aoaToSheetOptions);
}

export async function writeExcelFile<T>({
  excelFileName,
  excelFileExtension = 'xlsx',
  writingOptions = {},
  sheetName,
  rows,
  rowDataType = 'json',
  jsonToSheetOptions,
  aoaToSheetOptions,
}: WriteExcelFileParams<T>) {
  let worksheet: XLSX.WorkSheet;

  if (rowDataType === 'json' && !Array.isArray(rows[0])) {
    worksheet = createWorksheetFromJson(rows, jsonToSheetOptions);
  } else if (rowDataType === 'array') {
    worksheet = createWorksheetFromArray(rows, aoaToSheetOptions);
  } else {
    toast.error('지원하는 데이터 형식이 아닙니다.');
    throw new Error('Unsupported rowDataType');
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  console.log('worksheet: ', worksheet);
  console.log('workbook: ', workbook);

  XLSX.writeFile(workbook, `${excelFileName}.${excelFileExtension}`, {
    compression: true,
    bookType: excelFileExtension,
    ...writingOptions,
  });
}
