export function SidebarHeader({ title }: { title: string }) {
  return (
    <div style={{ paddingInline: 10, paddingBottom: 16 }}>
      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{title}</span>
    </div>
  );
}
