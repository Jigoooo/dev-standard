import { Checkbox, createHeader, THeader } from '@/shared/ui';
import { RRoleUser, RMenuMemberAuth } from './router-type.ts';
export function useRoleManagementHeaders() {
  const roleUserHeaders: THeader<RRoleUser>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('memberId', '아이디', 150),
    createHeader('memberNm', '이름', 150),
  ];

  const roleManagementHeaders: THeader<RMenuMemberAuth>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('allChecked', '', 60, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, handleRowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        const isAllChecked =
          rowData.useYn === 'Y' &&
          rowData.authIns === 'Y' &&
          rowData.authDel === 'Y' &&
          rowData.authSearch === 'Y' &&
          rowData.authMod === 'Y' &&
          rowData.excelExport === 'Y';

        const isNoneChecked =
          rowData.useYn !== 'Y' &&
          rowData.authIns !== 'Y' &&
          rowData.authDel !== 'Y' &&
          rowData.authSearch !== 'Y' &&
          rowData.authMod !== 'Y' &&
          rowData.excelExport !== 'Y';
        const isPartiallyChecked = !isAllChecked && !isNoneChecked;

        return (
          <Checkbox
            checked={isAllChecked}
            isPartial={isPartiallyChecked}
            onClick={() => {
              const newAllChecked = !cellData;
              const newAllCheckedValue = newAllChecked ? 'Y' : 'N';
              setCellData(newAllChecked);

              handleRowData('useYn', newAllCheckedValue);
              handleRowData('authIns', newAllCheckedValue);
              handleRowData('authDel', newAllCheckedValue);
              handleRowData('authSearch', newAllCheckedValue);
              handleRowData('authMod', newAllCheckedValue);
              handleRowData('excelExport', newAllCheckedValue);
            }}
          />
        );
      },
    }),
    createHeader('mainTitle', '메인메뉴', 150),
    createHeader('subTitle', '서브메뉴', 150),
    createHeader('useYn', '사용', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
    createHeader('authSearch', '조회', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
    createHeader('authIns', '생성', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
    createHeader('authMod', '수정', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
    createHeader('authDel', '삭제', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
    createHeader('excelExport', '엑셀', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, setCellData }) => {
        if (rowData.sub2Cd === 0) {
          return '';
        }

        return (
          <Checkbox
            checked={cellData === 'Y'}
            onClick={() => {
              setCellData(cellData === 'Y' ? 'N' : 'Y');
            }}
          />
        );
      },
    }),
  ];

  return {
    roleUserHeaders,
    roleManagementHeaders,
  };
}
