import { onCLS, onFID, onLCP } from 'web-vitals';

export const reportWebVital = (active = true) => {
  if (!active) return;

  onCLS(console.log, { reportAllChanges: true });
  onFID(console.log, { reportAllChanges: true });
  onLCP(console.log, { reportAllChanges: true });
};
