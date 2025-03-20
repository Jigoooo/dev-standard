import { Typography } from '@/shared/ui';

export function MainHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        display: 'flex',
        width: '100%',
        height: 60,
        minHeight: 60,
        alignItems: 'center',
      }}
    >
      <Typography style={{ color: '#000000', fontSize: '1.6rem', fontWeight: 700 }}>
        {title}
      </Typography>
    </div>
  );
}
