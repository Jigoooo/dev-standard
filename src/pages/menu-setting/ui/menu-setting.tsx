import { FlexColumn, FlexRow, SaveButton } from '@/shared/ui';

export function MenuSetting() {
  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
        gap: 6,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 6,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          height: 65,
        }}
      >
        <SaveButton onClick={() => {}} />
      </FlexRow>

      <FlexColumn></FlexColumn>
    </FlexColumn>
  );
}
