import { LOADING_Z_INDEX } from '@/shared/constants';

export const loadingStyles = {
  loader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: LOADING_Z_INDEX,
  } as const,

  running: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(var(--vh, 1vh) * 100',
    paddingTop: '20px',
  },
};
