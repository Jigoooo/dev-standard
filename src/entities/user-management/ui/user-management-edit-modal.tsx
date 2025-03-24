import { RMember } from '@/entities/member';
import { FlexRow, FlexColumn, Typography } from '@/shared/ui';

export function UserManagementEditModal({ memberInfo }: { memberInfo: RMember }) {
  console.log(memberInfo);
  return (
    <FlexRow>
      <FlexColumn style={{ width: '100%', padding: '16px' }}>
        {Object.entries(memberInfo).map(([key, value]) => (
          <FlexRow
            key={key}
            style={{
              padding: '8px',
              backgroundColor: '#f9f9f9',
              borderRadius: 4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              alignItems: 'center',
            }}
          >
            <Typography style={{ fontWeight: 600, width: '30%' }}>{key}</Typography>
            <Typography style={{ width: '70%' }}>{String(value)}</Typography>
          </FlexRow>
        ))}
      </FlexColumn>
    </FlexRow>
  );
}
