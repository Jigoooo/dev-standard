import { Checkbox, THeader } from 'shared/ui';
import { RRoleUser, RMenuMemberAuth } from '@/entities/role-management';
export function useRoleManagementHeaders() {
  const roleUserHeaders: THeader<RRoleUser>[] = [
    {
      id: 'index',
      pin: 'left',
      dataAlign: 'right',
      label: '',
      width: 60,
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'memberId',
      pin: 'view',
      dataAlign: 'left',
      label: '아이디',
      width: 150,
      sorter: {
        sortable: true,
        direction: null,
      },
      filter: {
        filterType: 'text',
        filterValue: '',
      },
    },
    {
      id: 'memberNm',
      pin: 'view',
      dataAlign: 'left',
      label: '이름',
      width: 150,
      sorter: {
        sortable: true,
        direction: null,
      },
      filter: {
        filterType: 'text',
        filterValue: '',
      },
    },
  ];

  const roleManagementHeaders: THeader<RMenuMemberAuth>[] = [
    {
      id: 'index',
      pin: 'left',
      dataAlign: 'right',
      label: '',
      width: 60,
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'allChecked',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '',
      width: 60,
      cell: ({ cellData, rowData, handleRowData, setCellData }) => {
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

        console.log(rowData);

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
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'menuTitle',
      pin: 'view',
      dataAlign: 'left',
      label: '메뉴명',
      width: 150,
      sorter: {
        sortable: true,
        direction: null,
      },
      filter: {
        filterType: 'text',
        filterValue: '',
      },
    },
    {
      id: 'useYn',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '사용',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
    {
      id: 'authSearch',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '조회',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
    {
      id: 'authIns',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '생성',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
    {
      id: 'authMod',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '수정',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
    {
      id: 'authDel',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '삭제',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
    {
      id: 'excelExport',
      pin: 'view',
      headerAlign: 'center',
      dataAlign: 'center',
      label: '엑셀',
      width: 80,
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
      sorter: {
        sortable: true,
        direction: null,
      },
    },
  ];

  return {
    roleUserHeaders,
    roleManagementHeaders,
  };
}
