import { createHeader, ModifyButton, THeader } from '@/shared/ui';
import { RRoleUser } from '@/entities/router';

export function useUserManagementHeaders() {
  const userManagementHeaders: THeader<RRoleUser>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('memberId', '아이디', 150),
    createHeader('memberNm', '이름', 150),
    createHeader('button', '', 150, {
      filter: undefined,
      cell: () => {
        return <ModifyButton />;
      },
    }),
  ];

  return userManagementHeaders;
}
