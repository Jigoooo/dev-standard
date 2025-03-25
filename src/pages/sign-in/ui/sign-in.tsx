import { useNavigate } from 'react-router-dom';

import TriphosLogo from '@/shared/assets/images/triphos_logo.png';

import { Router, useRouterMenuContext } from '@/entities/router';
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
import { localStorageKey } from '@/shared/constants';
import { setToken } from '@/entities/auth';
import { PSignIn, useSignInMutation } from '@/shared/api';

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
  const saveId = localStorage.getItem(localStorageKey.ID) ?? '';
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
            width: 480,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.06)',
            paddingInline: 40,
            paddingBlock: 30,
            gap: 30,
          }}
          action={signIn}
        >
          <SignInHeader />
          <SignInForm
            saveId={saveId}
            saveIdChecked={saveIdChecked}
            toggleSaveIdChecked={toggleSaveIdChecked}
          />
          <Button type={'submit'} style={{ width: '100%', height: 48 }}>
            <Typography style={{ fontSize: '1rem', fontWeight: 600 }}>로그인</Typography>
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
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
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
        gap: 14,
      }}
    >
      <FlexColumn style={{ width: '100%', gap: 4 }}>
        <Typography style={{ color: '#555555', fontWeight: 500, fontSize: '0.8rem' }}>
          아이디
        </Typography>
        <Input
          name={signInFields.id}
          defaultValue={saveId}
          style={{ width: '100%', height: 42 }}
          autoComplete={'current-password'}
        />
      </FlexColumn>
      <FlexColumn style={{ width: '100%', gap: 4 }}>
        <Typography style={{ color: '#555555', fontWeight: 500, fontSize: '0.8rem' }}>
          비밀번호
        </Typography>
        <Input
          name={signInFields.password}
          style={{ width: '100%', height: 42 }}
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
    const { id, password } = getFormValues<PSignIn>(formData, signInFields);
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
          if (!data.success) {
            dialog.warning({
              title: '로그인 실패',
              contents: data?.msg ?? '아이디 비밀번호를 다시 확인해 주세요.',
            });

            return;
          }

          if (data.data) {
            setToken({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              expiresIn: data.data.expiresIn,
            });

            updateMainRouteChildren(data.data.menuList);
          }

          if (saveIdChecked) {
            localStorage.setItem(localStorageKey.ID, id);
          } else {
            localStorage.removeItem(localStorageKey.ID);
          }

          navigate(Router.MAIN, { viewTransition: true, replace: true });
        },
      },
    );
  };
}
