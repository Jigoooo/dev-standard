export type ApiResponseType<TData> = {
  message: string;
  data_type: string;
  error_code?: string;
  data?: TData | null;
  is_success: boolean;
};

export type AdapterResponseType<TData> = {
  message: string;
  dataType: string;
  errorCode?: string;
  code: number;
  data?: TData | null;
  isSuccess: boolean;
};

export class ResponseAdapter<TData> {
  private value: ApiResponseType<TData>;

  constructor(obj: ApiResponseType<TData>) {
    this.value = obj;
  }

  adapt(code: number): AdapterResponseType<TData> {
    return {
      code: code,
      errorCode: this.value.error_code,
      dataType: this.value.data_type,
      message: this.value.message,
      data: this.value.data,
      isSuccess: this.value.is_success,
    };
  }
}
