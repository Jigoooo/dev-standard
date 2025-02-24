import { http, HttpResponse } from 'msw';

export const handlers = [
  // 조회 (GET)
  http.get('/api/items', () => {
    return HttpResponse.json([], {
      status: 200,
      statusText: 'OK',
    });
  }),

  // 생성 (POST)
  http.post('/api/items', () => {
    return HttpResponse.json([], {
      status: 200,
      statusText: 'OK',
    });
  }),
];
