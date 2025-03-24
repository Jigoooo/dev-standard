import { CSSProperties } from 'react';

export function VerticalTable({
  data,
  style,
}: {
  data: any[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        ...style,
      }}
    >
      <tbody>
        {data.map((row, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '8px',
                backgroundColor: '#f2f2f2',
                verticalAlign: 'top',
              }}
            >
              {row.label}
            </th>
            <td style={{ padding: '8px' }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
