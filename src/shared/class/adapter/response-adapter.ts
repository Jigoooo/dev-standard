export type ApiResponseType<T> = {
  code: number;
  msg: string;
  data?: T;
  success: boolean;
};

type AdapterResponseType<T> = {
  code: number;
  msg: string;
  data?: T;
  success: boolean;
};

export class ResponseAdapter<T> {
  private value: ApiResponseType<T>;

  constructor(obj: ApiResponseType<T>) {
    this.value = obj;
  }

  adapt(): AdapterResponseType<T> {
    return {
      code: this.value.code,
      msg: this.value.msg,
      data: this.value.data,
      success: this.value.success,
    };
  }
}
