import type { CSSProperties } from 'react';

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
        {data.map((_, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '8px',
                backgroundColor: '#f2f2f2',
                verticalAlign: 'top',
              }}
            >
              {index}
            </th>
            <td style={{ padding: '8px' }}>{index}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
