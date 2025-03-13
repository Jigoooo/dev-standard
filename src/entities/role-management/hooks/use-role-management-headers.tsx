import { THeader } from '@/shared/components';
import { RRoleUser, RAuthMenu } from '@/entities/role-management';
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

  const roleManagementHeaders: THeader<RAuthMenu>[] = [
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
      width: 60,
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
      width: 60,
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
      width: 60,
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
      width: 60,
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
      width: 60,
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
