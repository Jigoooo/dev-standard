import { useNavigate } from 'react-router-dom';

import TriphosLogo from '@/shared/assets/images/triphos_logo.png';

import { Router } from '@/entities/router';
import { Form, Input, Checkbox, Button, dialogActions, DialogType } from '@/shared/components';
import { menus } from '@/entities/menu';
import { FlexColumn, FlexRow } from '@/shared/components';
import { useToggle } from '@/shared/hooks';
import { getFormValues } from '@/shared/lib';
import { localStorageKey } from '@/shared/constants';
import { useSignInService } from '@/entities/auth/api';

const signInFields: Record<
  keyof {
    id: string;
    password: string;
  },
  string
> = {
  id: 'id',
  password: 'password',
};

export function SignIn() {
  const navigate = useNavigate();
  const saveId = localStorage.getItem(localStorageKey.ID) ?? '';

  const [saveIdChecked, toggleSaveIdChecked] = useToggle(!!saveId);

  const signInService = useSignInService();

  const signIn = (formData: FormData) => {
    const { id, password } = getFormValues(formData, signInFields);

    if (!id) {
      return dialogActions.openDialog({
        dialogType: DialogType.WARNING,
        contents: '아이디를 입력해 주세요.',
      });
    }

    if (!password) {
      return dialogActions.openDialog({
        dialogType: DialogType.WARNING,
        contents: '비밀번호를 입력해 주세요.',
      });
    }

    signInService.mutate(
      { id, password },
      {
        onSuccess: (data) => {
          if (!data.success) {
            dialogActions.openDialog({
              dialogType: DialogType.WARNING,
              title: '로그인 실패',
              contents: data?.msg ?? '아이디 비밀번호를 다시 확인해 주세요.',
            });

            return;
          }

          if (saveIdChecked) {
            localStorage.setItem(localStorageKey.ID, id);
          } else {
            localStorage.removeItem(localStorageKey.ID);
          }

          navigate(`${Router.MAIN}/${menus[0].router}`, { viewTransition: true });
        },
      },
    );
  };

  return (
    <FlexRow style={{ width: '100vw', height: '100vh', backgroundColor: '#f8f8f8' }}>
      <FlexRow style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 480,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.06)',
            paddingInline: 40,
            paddingBlock: 30,
            gap: 40,
          }}
          action={signIn}
        >
          <FlexColumn
            className={'selection-none'}
            style={{
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={TriphosLogo} alt={'로고'} />
          </FlexColumn>
          <FlexColumn
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <Input
              name={signInFields.id}
              defaultValue={saveId}
              style={{ width: '100%', height: 48 }}
              placeholder={'아이디'}
            />
            <Input
              name={signInFields.password}
              style={{ width: '100%', height: 48 }}
              type={'password'}
              placeholder={'비밀번호'}
            />
            <FlexRow
              style={{
                width: '100%',
              }}
            >
              <Checkbox
                checked={saveIdChecked}
                onClick={toggleSaveIdChecked}
                label={'아이디 저장'}
              />
            </FlexRow>
          </FlexColumn>
          <Button type={'submit'} style={{ width: '100%', height: 48 }}>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>로그인</span>
          </Button>
        </Form>
      </FlexRow>
    </FlexRow>
  );
}
