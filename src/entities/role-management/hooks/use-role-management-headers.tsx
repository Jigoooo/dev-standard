import { THeader } from '@/shared/components';
import { RAuthMenu } from '@/entities/role-management';
import { RRoleUser } from '@/entities/role-management/model/role-management-type.ts';
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
      id: 'name',
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
