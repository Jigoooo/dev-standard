import { useNavigate } from 'react-router-dom';

import {
  createHeader,
  dialogActions,
  DialogType,
  ModalLayout,
  ModifyButton,
  THeader,
  useModal,
} from '@/shared/ui';
import { RRoleUser } from '@/entities/router';
import { UserManagementEditModal } from '@/entities/user-management';
import { getMemberInfoApi } from '../api/user-management-api.ts';
import { handleAuthError } from '@/entities/auth';
import { RMember } from '@/entities/member';

export function useUserManagementHeaders() {
  const navigate = useNavigate();

  const userManagementEditModal = useModal();
  const openUserManagementEditModal = async (memberId: string) => {
    let responseMemberInfo = await getMemberInfoApi({
      memberId,
    });

    const isError = await handleAuthError({
      data: responseMemberInfo,
      onUnauthenticated: () => navigate('/', { replace: true }),
      onRefreshSuccess: () => {},
    });

    if (isError) {
      responseMemberInfo = await getMemberInfoApi({
        memberId,
      });
    }

    const memberInfo = responseMemberInfo.data?.memberInfo;

    if (!memberInfo) {
      dialogActions.open({
        dialogType: DialogType.ERROR,
        overlayClose: true,
        title: '사용자 정보 조회 실패',
        contents: '사용자 정보를 조회할 수 없습니다.',
      });
      return;
    }

    userManagementEditModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          title={'사용자 수정'}
          close={close}
          containerStyle={{ width: 800, height: 600 }}
        >
          <UserManagementEditModal memberInfo={memberInfo} />
        </ModalLayout>
      );
    });
  };

  const userManagementHeaders: THeader<RRoleUser>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('memberId', '아이디', 150),
    createHeader('memberNm', '이름', 150),
    createHeader('button', '', 80, {
      filter: undefined,
      cell: ({ rowData }) => {
        return <ModifyButton onClick={() => openUserManagementEditModal(rowData.memberId)} />;
      },
    }),
  ];

  const memberInfoColumnLabelsMapping: Partial<RMember> = {
    memberId: '아이디',
    memberNm: '이름',
    email: '이메일',
    phone: '전화번호',
  };

  return { userManagementHeaders, memberInfoColumnLabelsMapping };
}
