import { useNavigate } from 'react-router-dom';

import TriphosLogo from '@/shared/assets/images/triphos_logo.png';

import { useRouterMenuContext } from '@/entities/router';
import {
  FlexColumn,
  FlexRow,
  Form,
  Input,
  Checkbox,
  Button,
  dialog,
  Typography,
} from '@/shared/ui';
import { useToggle } from '@/shared/hooks';
import { createValidator, getFormValues } from '@/shared/lib';
import type { SignInParameter } from '@/shared/api';
import { setToken, useSignInMutation } from '@/shared/api';
import { Router } from '@/shared/router';
import { getId, removeId, setId } from '@/entities/auth';
import { memberActions } from '@/entities/member';

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
  const saveId = getId();
  const [saveIdChecked, toggleSaveIdChecked] = useToggle(!!saveId);

  const signIn = useSignIn({
    saveIdChecked,
  });

  return (
    <FlexRow style={{ width: '100vw', height: '100vh', backgroundColor: '#f8f8f8' }}>
      <FlexRow style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '27rem',
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.8rem',
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.06)',
            paddingInline: '2.4rem',
            paddingBlock: '1.8rem',
            gap: '1.5rem',
          }}
          action={signIn}
        >
          <SignInHeader />
          <SignInForm
            saveId={saveId}
            saveIdChecked={saveIdChecked}
            toggleSaveIdChecked={toggleSaveIdChecked}
          />
          <Button type={'submit'} style={{ width: '100%', height: '2.5rem' }}>
            <Typography style={{ fontSize: '0.9rem', fontWeight: 600 }}>로그인</Typography>
          </Button>
        </Form>
      </FlexRow>
    </FlexRow>
  );
}

function SignInHeader() {
  return (
    <FlexColumn
      className={'selection-none'}
      style={{
        height: '4.375rem',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
      }}
    >
      <img src={TriphosLogo} alt={'로고'} width={120} />
      <Typography style={{ color: '#555555', fontWeight: 600, fontSize: '1.2rem' }}>
        개발 표준
      </Typography>
    </FlexColumn>
  );
}

function SignInForm({
  saveId,
  saveIdChecked,
  toggleSaveIdChecked,
}: {
  saveId: string;
  saveIdChecked: boolean;
  toggleSaveIdChecked: () => void;
}) {
  return (
    <FlexColumn
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.9rem',
      }}
    >
      <FlexColumn style={{ width: '100%', gap: '0.4rem' }}>
        <Typography style={{ color: '#555555', fontWeight: 500, fontSize: '0.8rem' }}>
          아이디
        </Typography>
        <Input
          name={signInFields.id}
          defaultValue={saveId}
          style={{ width: '100%', height: '2.4rem' }}
          autoComplete={'current-password'}
        />
      </FlexColumn>
      <FlexColumn style={{ width: '100%', gap: '0.4rem' }}>
        <Typography style={{ color: '#555555', fontWeight: 500, fontSize: '0.8rem' }}>
          비밀번호
        </Typography>
        <Input
          name={signInFields.password}
          style={{ width: '100%', height: '2.4rem' }}
          type={'password'}
          autoComplete={'current-password'}
        />
      </FlexColumn>

      <FlexRow
        style={{
          width: '100%',
        }}
      >
        <Checkbox checked={saveIdChecked} onClick={toggleSaveIdChecked} label={'아이디 저장'} />
      </FlexRow>
    </FlexColumn>
  );
}

function useSignIn({ saveIdChecked }: { saveIdChecked: boolean }) {
  const navigate = useNavigate();

  const signInMutation = useSignInMutation();
  const { updateMainRouteChildren } = useRouterMenuContext();

  return (formData: FormData) => {
    const { id, password } = getFormValues<SignInParameter>(formData, signInFields);
    const idWithValidated = createValidator(id)
      .required({ message: '아이디를 입력해 주세요.' })
      .validate();
    const passwordWithValidated = createValidator(password)
      .required({ message: '비밀번호를 입력해 주세요.' })
      .validate();

    if (idWithValidated.error) {
      return dialog.warning({
        contents: idWithValidated.errorMessage,
      });
    }

    if (passwordWithValidated.error) {
      return dialog.warning({
        contents: passwordWithValidated.errorMessage,
      });
    }

    signInMutation.mutate(
      { id: idWithValidated.value, password: passwordWithValidated.value },
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
            dialog.warning({
              title: '로그인 실패',
              contents: data?.message ?? '아이디 비밀번호를 다시 확인해 주세요.',
            });

            return;
          }

          memberActions.setMemberId(id);

          if (data.data) {
            setToken({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expirationDate: data.data.expirationDate,
            });

            updateMainRouteChildren(data.data.menus);
          }

          if (saveIdChecked) {
            setId(id);
          } else {
            removeId();
          }

          navigate(Router.MAIN, { viewTransition: true, replace: true });
        },
      },
    );
  };
}
