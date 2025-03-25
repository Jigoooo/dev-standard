import axios from 'axios';

import { interceptors } from './interceptors.ts';

export const customedAxios = interceptors(
  axios.create({
    baseURL: import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      accept: 'application/json,',
    },
    responseType: 'json',
    paramsSerializer: customParamsSerializer,
    validateStatus: function () {
      // switch (status) {
      //   case 200:
      //     return true;
      //   case 201:
      //     return true;
      //   case 400:
      //     return true;
      //   case 401:
      //     return true;
      //   case 404:
      //     return true;
      //   default:
      //     return false;
      // }

      // return !(status === 401 || status === 403 || status === 500);
      return true;
    },
    timeout: 100000,
    timeoutErrorMessage: '요청시간이 초과되었습니다.',
  }),
);

type Params = Record<
  string,
  (string | number | boolean | (string | number | boolean)[]) | null | undefined
>;

function customParamsSerializer(params: Params) {
  const parts: string[] = [];
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
        });
      } else if (value !== null && value !== undefined) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
  }
  return parts.join('&');
}
