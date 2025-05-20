import type { THeader } from '@/shared/ui';
import { Checkbox, createHeader } from '@/shared/ui';
import type { RoleUserResponse } from '@/shared/api';
import type { MenuMemberAuthType } from '@/entities/member';
export function useRoleManagementHeaders() {
  const roleUserHeaders: THeader<RoleUserResponse>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('id', '아이디', 150),
    createHeader('name', '이름', 150),
  ];

  const roleManagementHeaders: THeader<MenuMemberAuthType>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('allChecked', '', 60, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, rowData, handleRowData, setCellData }) => {
        const isAllChecked =
          rowData.canUse &&
          rowData.canInsert &&
          rowData.canDelete &&
          rowData.canSearch &&
          rowData.canModify &&
          rowData.canExport;

        const isNoneChecked =
          !rowData.canUse &&
          !rowData.canInsert &&
          !rowData.canDelete &&
          !rowData.canSearch &&
          !rowData.canModify &&
          !rowData.canExport;
        const isPartiallyChecked = !isAllChecked && !isNoneChecked;

        return (
          <Checkbox
            checked={isAllChecked}
            isPartial={isPartiallyChecked}
            onClick={() => {
              const newAllChecked = !cellData;
              setCellData(newAllChecked);

              handleRowData('canUse', newAllChecked);
              handleRowData('canInsert', newAllChecked);
              handleRowData('canDelete', newAllChecked);
              handleRowData('canSearch', newAllChecked);
              handleRowData('canModify', newAllChecked);
              handleRowData('canExport', newAllChecked);
            }}
          />
        );
      },
    }),
    createHeader('parentTitle', '상위메뉴', 150),
    createHeader('title', '메뉴', 150),
    createHeader('canUse', '사용', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
            }}
          />
        );
      },
    }),
    createHeader('canSearch', '조회', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
            }}
          />
        );
      },
    }),
    createHeader('canInsert', '생성', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
            }}
          />
        );
      },
    }),
    createHeader('canModify', '수정', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
            }}
          />
        );
      },
    }),
    createHeader('canDelete', '삭제', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
            }}
          />
        );
      },
    }),
    createHeader('canExport', '엑셀', 80, {
      headerAlign: 'center',
      dataAlign: 'center',
      filter: undefined,
      cell: ({ cellData, setCellData }) => {
        return (
          <Checkbox
            checked={cellData}
            onClick={() => {
              setCellData(!cellData);
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
