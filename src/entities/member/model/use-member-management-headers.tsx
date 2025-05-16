import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { THeader } from '@/shared/ui';
import { createHeader, dialog, ModalLayout, ModifyButton, useModal } from '@/shared/ui';
import { MemberManagementEditModal } from '../ui';
import type { MemberResponse, RoleUserResponse } from '@/shared/api';
import { handleAuthError, useUpdateMemberMutation, getMemberApi } from '@/shared/api';

export function useMemberManagementHeaders() {
  const navigate = useNavigate();

  const updateMemberMutation = useUpdateMemberMutation();
  const updateMember = (memberInfo: MemberResponse, closeModal: () => void) => {
    updateMemberMutation.mutate(memberInfo, {
      onSuccess: async (data, variables) => {
        const isError = await handleAuthError({
          data,
          onUnauthenticated: () => navigate('/', { replace: true }),
          onOtherError: () => {
            dialog.error({
              title: '사용자 수정 실패',
              contents: data?.message ?? '관리자에게 문의해 주세요.',
            });
          },
          onRefreshSuccess: () => {
            updateMemberMutation.mutate(variables, {
              onSuccess: (data) => {
                if (data.success) {
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

  const updateMemberConfirmation = (memberInfo: MemberResponse, closeModal: () => void) => {
    dialog.info({
      title: '사용자 수정',
      contents: '사용자 정보를 수정하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => updateMember(memberInfo, closeModal),
    });
  };

  const userManagementEditModal = useModal();
  const openUserManagementEditModal = async (memberId: string) => {
    let responseMemberInfo = await getMemberApi({
      memberId,
    });

    const isError = await handleAuthError({
      data: responseMemberInfo,
      onUnauthenticated: () => navigate('/', { replace: true }),
      onRefreshSuccess: () => {},
    });

    if (isError) {
      responseMemberInfo = await getMemberApi({
        memberId,
      });

      if (!responseMemberInfo.success) {
        dialog.error({
          title: '사용자 조회 실패',
          contents: responseMemberInfo.message ?? '관리자에게 문의해 주세요.',
        });
        return;
      }
    }

    const memberInfo = responseMemberInfo.data?.memberInfo;

    if (!memberInfo) {
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
            memberInfo={memberInfo}
            onSave={(memberInfo) => updateMemberConfirmation(memberInfo, close)}
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
    phone: '전화번호',
  };

  return { userManagementHeaders, memberInfoColumnLabelsMapping };
}
