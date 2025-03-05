import { Adapter } from './adapter';
import { AdapterResponseType, ApiResponseType, ResponseAdapter } from './response-adapter.ts';

export async function apiRequest<T>(
  request: Promise<any>,
  adaptFn?: (item: ApiResponseType<T>, status: number) => AdapterResponseType<T>,
): Promise<AdapterResponseType<T>> {
  try {
    const response = await request;

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
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      code: -1,
      msg: errorMessage,
      data: null,
      success: false,
    };
  }
}
