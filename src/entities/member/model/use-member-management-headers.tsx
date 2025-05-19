import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { THeader } from '@/shared/ui';
import { createHeader, dialog, ModalLayout, ModifyButton, useModal } from '@/shared/ui';
import { MemberManagementEditModal } from '../ui';
import type { MemberResponse, MemberData, RoleUserResponse } from '@/shared/api';
import { handleAuthError, useUpdateMemberMutation, getMemberApi } from '@/shared/api';
import { Router } from '@/shared/router';

export function useMemberManagementHeaders() {
  const navigate = useNavigate();

  const updateMemberMutation = useUpdateMemberMutation();
  const updateMember = (memberData: MemberData, closeModal: () => void) => {
    updateMemberMutation.mutate(memberData, {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
          onOtherError: () => {
            dialog.error({
              title: '사용자 수정 실패',
              contents: data?.message ?? '관리자에게 문의해 주세요.',
            });
          },
          onRefreshSuccess: () => {
            updateMemberMutation.mutate(variables, {
              onSuccess: (data) => {
                if (data.isSuccess) {
                  toast.success('사용자 수정 성공');
                  closeModal();
                }
              },
            });
          },
        });

        if (!isError) {
          toast.success('사용자 수정 성공');
          closeModal();
        }
      },
    });
  };

  const updateMemberConfirmation = (member: MemberData, closeModal: () => void) => {
    dialog.info({
      title: '사용자 수정',
      contents: '사용자 정보를 수정하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => updateMember(member, closeModal),
    });
  };

  const userManagementEditModal = useModal();
  const openUserManagementEditModal = async (memberId: string) => {
    let responseMemberInfo = await getMemberApi({
      memberId,
    });

    const isError = await handleAuthError({
      data: responseMemberInfo,
      onUnauthenticated: () => navigate(Router.SIGN_IN, { replace: true }),
      onRefreshSuccess: () => {},
    });

    if (isError) {
      responseMemberInfo = await getMemberApi({
        memberId,
      });

      if (!responseMemberInfo.isSuccess) {
        dialog.error({
          title: '사용자 조회 실패',
          contents: responseMemberInfo.message ?? '관리자에게 문의해 주세요.',
        });
        return;
      }
    }

    const member = responseMemberInfo.data;

    if (!member) {
      dialog.error({
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
          <MemberManagementEditModal
            member={member}
            onSave={(member) => updateMemberConfirmation(member, close)}
          />
        </ModalLayout>
      );
    });
  };

  const userManagementHeaders: THeader<RoleUserResponse>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('id', '아이디', 150),
    createHeader('name', '이름', 150),
    createHeader('button', '', 80, {
      filter: undefined,
      cell: ({ rowData }) => {
        return <ModifyButton onClick={() => openUserManagementEditModal(rowData.id)} />;
      },
    }),
  ];

  const memberInfoColumnLabelsMapping: Partial<MemberResponse> = {
    id: '아이디',
    name: '이름',
    email: '이메일',
    phoneNumber: '전화번호',
  };

  return { userManagementHeaders, memberInfoColumnLabelsMapping };
}
