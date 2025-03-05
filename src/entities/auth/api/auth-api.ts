import { customedAxios } from '@/shared/api';
import { PSignIn } from '@/entities/auth/model';
import { Adapter, AdapterResponseType, ApiResponseType, ResponseAdapter } from '@/shared/class';

export async function signInApi(params: PSignIn): Promise<AdapterResponseType<any>> {
  try {
    const response = await customedAxios.post(
      '/auth/login',
      {},
      {
        params,
      },
    );
    console.log(response);

    return Adapter.from(response.data).to((item: ApiResponseType<any>) =>
      new ResponseAdapter(item).adapt(),
    );
  } catch {
    return {
      code: -1,
      msg: 'error',
      data: null,
      success: false,
    };
  }
}
