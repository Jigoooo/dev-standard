export type ApiResponseType<TData> = {
  message: string;
  dataType: string;
  errorCode?: string;
  data?: TData | null;
  success: boolean;
};

export type AdapterResponseType<TData> = {
  message: string;
  dataType: string;
  errorCode?: string;
  code: number;
  data?: TData | null;
  success: boolean;
};

export class ResponseAdapter<TData> {
  private value: ApiResponseType<TData>;

  constructor(obj: ApiResponseType<TData>) {
    this.value = obj;
  }

  adapt(code: number): AdapterResponseType<TData> {
    return {
      code: code,
      errorCode: this.value.errorCode,
      dataType: this.value.dataType,
      message: this.value.message,
      data: this.value.data,
      success: this.value.success,
    };
  }
}
