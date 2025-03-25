import { RMember } from '@/entities/member';
import { FlexRow, FlexColumn, Typography } from '@/shared/ui';
import { useUserManagementHeaders } from '@/entities/user-management';

export function UserManagementEditModal({ memberInfo }: { memberInfo: RMember }) {
  const { memberInfoColumnLabelsMapping } = useUserManagementHeaders();
  const filteredData = Object.fromEntries(
    Object.entries(memberInfo).filter(([key]) => key in memberInfoColumnLabelsMapping),
  );
  const filteredDataEntries = Object.entries(filteredData);

  return (
    <FlexRow>
      <FlexColumn style={{ width: '100%', border: '1px solid #ddd' }}>
        {filteredDataEntries.map(([key, value], index) => {
          const headerLabel = memberInfoColumnLabelsMapping[key as keyof RMember];

          if (!headerLabel) {
            return;
          }

          return (
            <FlexRow
              key={key}
              style={{
                borderRadius: 4,
                alignItems: 'center',
                borderBottom: index !== filteredDataEntries.length - 1 ? '1px solid #ddd' : 'none',
              }}
            >
              <FlexRow style={{ width: '20%', borderRight: '1px solid #ddd', padding: 6 }}>
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: '0.86rem',
                  }}
                >
                  {headerLabel}
                </Typography>
              </FlexRow>
              <FlexRow style={{ width: '80%', padding: 6 }}>
                <Typography
                  style={{
                    fontSize: '0.82rem',
                  }}
                >
                  {String(value)}
                </Typography>
              </FlexRow>
            </FlexRow>
          );
        })}
      </FlexColumn>
    </FlexRow>
  );
}
