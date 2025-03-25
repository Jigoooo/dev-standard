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
import { RMember, useUpdateMemberMutation } from '@/entities/member';
import { toast } from 'sonner';

export function useUserManagementHeaders() {
  const navigate = useNavigate();

  const updateMemberMutation = useUpdateMemberMutation();
  const updateMember = (memberInfo: RMember) => {
    updateMemberMutation.mutate(memberInfo, {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate('/', { replace: true }),
          onOtherError: () => {
            dialogActions.open({
              title: '사용자 수정 실패',
              contents: data?.msg ?? '관리자에게 문의해 주세요.',
              dialogType: DialogType.ERROR,
            });
          },
          onRefreshSuccess: () => {
            updateMemberMutation.mutate(variables, {
              onSuccess: (data) => {
                if (data.success) {
                  toast.success('사용자 수정 성공');
                  close();
                }
              },
            });
          },
        });

        if (!isError) {
          toast.success('사용자 수정 성공');
          close();
        }
      },
    });
  };

  const updateMemberConfirmation = (memberInfo: RMember) => {
    dialogActions.open({
      title: '사용자 수정',
      contents: '사용자 정보를 수정하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => updateMember(memberInfo),
    });
  };

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
          containerStyle={{ width: 600, height: 300 }}
        >
          <UserManagementEditModal memberInfo={memberInfo} onSave={updateMemberConfirmation} />
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
