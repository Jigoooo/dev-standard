import type { BookType, Sheet2JSONOpts } from 'xlsx-js-style';
import XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

import type { WriteExcelFileParams } from './excel-type.ts';

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

export function fitToColumn<T>(headerRow: T[], bodyRow: T[], minWidth = 0) {
  const maxCols = Math.max(headerRow.length, bodyRow.length);
  const columns = [];

  for (let col = 0; col < maxCols; col++) {
    const headerCell = headerRow[col];
    const bodyCell = bodyRow[col];
    const headerWidth = computeCellWidth(headerCell, minWidth);
    const bodyWidth = computeCellWidth(bodyCell, minWidth);

    const width = Math.max(headerWidth, bodyWidth, minWidth);
    columns.push({ width });
  }
  return columns;
}

function computeCellWidth<T>(cell: T, minWidth: number): number {
  if (!cell) return minWidth;

  const text = cell ? cell.toString() : '';
  const cellLength = text.length;

  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ가-힣]/.test(text);
  const isSingleDigitNumber = text.length === 1 && /[0-9]/.test(text);
  const multiplier = isSingleDigitNumber ? 2 : isKorean ? 4 : 2;
  const width = cellLength * multiplier;
  return Math.max(width, minWidth);
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
  rows: T[][],
  aoaToSheetOptions?: XLSX.AOA2SheetOpts,
): XLSX.WorkSheet {
  if (!Array.isArray(rows) || !Array.isArray(rows[0])) {
    throw new Error('For array type, rows must be an array of arrays.');
  }
  return XLSX.utils.aoa_to_sheet(rows, aoaToSheetOptions);
}

/**
 * 워크시트에 헤더와 본문 스타일을 적용하는 함수.
 * @param worksheet - 스타일을 적용할 XLSX.WorkSheet 객체.
 * @param headerStyle - 헤더 셀에 적용할 스타일 객체.
 * @param bodyStyle - 본문 셀에 적용할 스타일 객체.
 * @param headerRowIndex - 헤더가 위치한 행 인덱스 (기본값: 0, 즉 첫 번째 행).
 */
export function applyStylesToWorksheet(
  worksheet: XLSX.WorkSheet,
  headerStyle: XLSX.CellStyle,
  bodyStyle: XLSX.CellStyle,
  headerRowIndex: number = 0,
) {
  const rangeRef = worksheet['!ref'];
  if (!rangeRef) return;

  const range = XLSX.utils.decode_range(rangeRef);

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellRef];
      if (cell) {
        if (row === headerRowIndex) {
          cell.s = { ...(cell.s || {}), ...headerStyle };
        } else {
          cell.s = { ...(cell.s || {}), ...bodyStyle };
        }
      }
    }
  }
}

const defaultHeaderStyle: XLSX.CellStyle = {
  font: { name: '맑은 고딕 (본문)', sz: 11, bold: false, color: { rgb: '000000' } },
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFF54' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  },
};

const defaultBodyStyle: XLSX.CellStyle = {
  font: { name: '맑은 고딕 (본문)', sz: 11, bold: false, color: { rgb: '000000' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left: { style: 'thin', color: { rgb: 'CCCCCC' } },
    right: { style: 'thin', color: { rgb: 'CCCCCC' } },
  },
};

export async function writeExcelFile<T>({
  excelFileName,
  excelFileExtension = 'xlsx',
  writingOptions = {},
  sheetName,
  rows,
  headerStyle = defaultHeaderStyle,
  bodyStyle = defaultBodyStyle,
  rowDataType = 'array',
  jsonToSheetOptions,
  aoaToSheetOptions,
}: WriteExcelFileParams<T>) {
  let worksheet: XLSX.WorkSheet;

  if (rowDataType === 'json' && !Array.isArray(rows[0])) {
    worksheet = createWorksheetFromJson(rows as T[], jsonToSheetOptions);
  } else if (rowDataType === 'array') {
    worksheet = createWorksheetFromArray(rows as T[][], aoaToSheetOptions);
    if (Array.isArray(rows[0]) && Array.isArray(rows[rows.length - 1])) {
      worksheet['!cols'] = fitToColumn<T>(rows[0], rows[rows.length - 1] as T[]);
    }
  } else {
    toast.error('지원하는 데이터 형식이 아닙니다.');
    throw new Error('Unsupported rowDataType');
  }

  applyStylesToWorksheet(worksheet, headerStyle, bodyStyle, 0);

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
