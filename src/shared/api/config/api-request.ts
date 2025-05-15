import { AxiosError } from 'axios';

import { Adapter } from './adapter.ts';
import type { AdapterResponseType, ApiResponseType } from './response-adapter.ts';
import { ResponseAdapter } from './response-adapter.ts';
import { deepCamelize } from '@/shared/lib';

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
        dataType: 'OBJECT',
        code: response.status,
        message: response.data,
        data: null,
        success: false,
      };
    }

    let adapted: AdapterResponseType<T>;

    if (adaptFn) {
      adapted = Adapter.from(response.data).to((item: ApiResponseType<T>) =>
        adaptFn(item, response.status),
      );
    }

    adapted = Adapter.from(response.data).to((item: ApiResponseType<T>) =>
      new ResponseAdapter(item).adapt(response.status),
    );

    if (adapted.data != null) {
      adapted.data = deepCamelize<T>(adapted.data);
    }

    return adapted;
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
      dataType: 'OBJECT',
      code: status,
      message: errorMessage,
      data: null,
      success: false,
    };
  }
}
