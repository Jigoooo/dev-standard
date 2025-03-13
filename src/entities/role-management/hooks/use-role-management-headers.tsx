import { THeader } from '@/shared/components';
import { RRoleUser, RAuthMenu } from '@/entities/role-management';
export function useRoleManagementHeaders() {
  const roleUserHeaders: THeader<RRoleUser>[] = [
    {
      id: 'index',
      pin: 'left',
      align: 'right',
      label: '',
      width: 60,
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'memberId',
      pin: 'view',
      align: 'left',
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
      align: 'left',
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
      align: 'right',
      label: '',
      width: 60,
      sorter: {
        sortable: false,
      },
    },
    {
      id: 'menuId',
      pin: 'view',
      align: 'left',
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

  return {
    roleUserHeaders,
    roleManagementHeaders,
  };
}
