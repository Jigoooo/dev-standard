import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/app/app.tsx';
import { reportWebVital } from '@/app/web-vital';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('@/app/mocks');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

/*
// metric(측정도구) 이름
name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
// 측정된 현재값 (값이 작을수록 빠른성능을 뜻합니다)
value: number;
//  현재 측정값(current value)과 최신 측정값(last-reported value) 차이
//  첫번째 리포트에서 위 둘값은 항상 같습니다.
delta: number;
// 특정 측정도구를 나타대는 유니크한 ID 값으로 중복되는 값들을 관리할 때 사용된다.
id: string;
// 계산된 측정값들의 내용들이 배열로 나열 된다.
// ex) PerformanceNavigationTiming, LargestContentfulPaint
entries: (PerformanceEntry | FirstInputPolyfillEntry | NavigationTimingPolyfillEntry)[];
*/

if (import.meta.env.DEV) {
  reportWebVital(false);
}
