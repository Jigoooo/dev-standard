export type ApiResponseType<TData> = {
  msg: string;
  data?: TData | null;
  success: boolean;
};

export type AdapterResponseType<TData> = {
  code: number;
  msg: string;
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
      msg: this.value.msg,
      data: this.value.data,
      success: this.value.success,
    };
  }
}
