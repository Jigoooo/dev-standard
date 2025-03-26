import { Fragment, useState } from 'react';

import { RMember } from '@/shared/api';
import { FlexRow, FlexColumn, Typography, Input, SaveButton } from '@/shared/ui';
import { useMemberManagementHeaders } from '../model';

export function MemberManagementEditModal({
  memberInfo,
  onSave,
}: {
  memberInfo: RMember;
  onSave: (memberInfo: RMember) => void;
}) {
  const { memberInfoColumnLabelsMapping } = useMemberManagementHeaders();
  const [filteredData, setFilteredData] = useState(() =>
    Object.fromEntries(
      Object.entries(memberInfo).filter(([key]) => key in memberInfoColumnLabelsMapping),
    ),
  );

  const handleFilteredData = (key: string, value: any) => {
    setFilteredData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const filteredDataEntries = Object.entries(filteredData);

  return (
    <FlexColumn style={{ justifyContent: 'space-between', height: '100%' }}>
      <FlexColumn
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(100px, auto) 1fr',
          gridAutoRows: 38,
          border: '1px solid #ddd',
          width: '100%',
        }}
      >
        {filteredDataEntries.map(([key, value], index) => {
          const headerLabel = memberInfoColumnLabelsMapping[key as keyof RMember];

          if (!headerLabel) {
            return;
          }

          return (
            <Fragment key={key}>
              <FlexRow
                style={{
                  borderRight: '1px solid #ddd',
                  paddingLeft: 8,
                  paddingRight: 6,
                  backgroundColor: '#efefef',
                  alignItems: 'center',
                  borderBottom:
                    index !== filteredDataEntries.length - 1 ? '1px solid #ddd' : 'none',
                }}
              >
                <Typography
                  style={{
                    fontWeight: 500,
                    fontSize: '0.82rem',
                  }}
                >
                  {headerLabel}
                </Typography>
              </FlexRow>
              <FlexRow
                style={{
                  alignItems: 'center',
                  paddingInline: 4,
                  borderBottom:
                    index !== filteredDataEntries.length - 1 ? '1px solid #ddd' : 'none',
                }}
              >
                <Input
                  style={{ width: '100%', fontSize: '0.82rem' }}
                  value={String(value)}
                  onChange={(event) => {
                    handleFilteredData(key, event.target.value);
                  }}
                />
              </FlexRow>
            </Fragment>
          );
        })}
      </FlexColumn>

      <FlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
        <SaveButton
          style={{ paddingInline: 18 }}
          onClick={() =>
            onSave({
              ...memberInfo,
              ...filteredData,
            })
          }
        />
      </FlexRow>
    </FlexColumn>
  );
}
