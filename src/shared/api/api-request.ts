import { AxiosError } from 'axios';

import { Adapter } from './adapter';
import { AdapterResponseType, ApiResponseType, ResponseAdapter } from './response-adapter.ts';

export async function apiRequest<T>(
  request: Promise<any>,
  adaptFn?: (item: ApiResponseType<T>, status: number) => AdapterResponseType<T>,
): Promise<AdapterResponseType<T>> {
  try {
    const response = await request;

    if (response.status === 401 || response.status === 403) {
      console.clear();
    }

    if (typeof response.data === 'string') {
      return {
        code: response.status,
        msg: response.data,
        data: null,
        success: false,
      };
    }

    if (adaptFn) {
      return Adapter.from(response.data).to((item: ApiResponseType<T>) =>
        adaptFn(item, response.status),
      );
    }

    return Adapter.from(response.data).to((item: ApiResponseType<T>) =>
      new ResponseAdapter(item).adapt(response.status),
    );
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    let status = -1;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (error instanceof AxiosError) {
      errorMessage = error.message;
      status = error?.status ?? -1;
    }

    return {
      code: status,
      msg: errorMessage,
      data: null,
      success: false,
    };
  }
}
