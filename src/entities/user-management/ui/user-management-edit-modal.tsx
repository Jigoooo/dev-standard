import { RMember } from '@/entities/member';
import { FlexRow } from '@/shared/ui';

export function UserManagementEditModal({ memberInfo }: { memberInfo: RMember }) {
  console.log(memberInfo);
  return (
    <FlexRow>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <tbody>
          {Object.entries(memberInfo).map(([key, value]) => (
            <tr key={key} style={{ borderBottom: '1px solid #ddd' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '8px',
                  backgroundColor: '#f2f2f2',
                  verticalAlign: 'top',
                }}
              >
                {key}
              </th>
              <td style={{ padding: '8px' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FlexRow>
  );
}
