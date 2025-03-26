import { createHeader, Input, THeader, THeaderGroup } from '@/shared/ui';
import { RGridExample } from '@/entities/grid-example';

export function useGridExampleHeaders() {
  const gridExampleHeaderGroups: THeaderGroup<RGridExample>[] = [
    {
      groupLabel: 'Personal Info',
      headerIds: ['name', 'age', 'address', 'email', 'phone'],
    },
    {
      groupLabel: 'Employment',
      headerIds: ['jobTitle', 'department', 'salary', 'hireDate'],
    },
  ];

  const gridExampleHeaders: THeader<RGridExample>[] = [
    createHeader('index', '', 60, { pin: 'left', dataAlign: 'right', filter: undefined }),
    createHeader('check', '', 60, { pin: 'left', dataAlign: 'center', filter: undefined }),
    createHeader('name', '이름', 150, { pin: 'left' }),
    createHeader('email', '이메일', 250),
    createHeader('age', '나이', 120, { pin: 'right' }),
    createHeader('address', '주소', 250),
    createHeader('phone', '휴대폰번호', 250, {
      cell: ({ cellData, setCellData }) => {
        return (
          <Input
            style={{ width: '100%', height: 30 }}
            value={cellData}
            onChange={(event) => setCellData(event.target.value)}
            isFocusEffect={false}
          />
        );
      },
    }),
    createHeader('jobTitle', '직업', 250),
    createHeader('department', '직업', 300),
    createHeader('salary', '급여', 100, { pin: 'right' }),
    createHeader('hireDate', '고용일', 150),
  ];

  return {
    gridExampleHeaderGroups,
    gridExampleHeaders,
  };
}
