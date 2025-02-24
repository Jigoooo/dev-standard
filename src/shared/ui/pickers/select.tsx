import { ReactNode, useMemo, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';

type SelectOption = {
  label: ReactNode;
  value: string | number;
};

export function Select({
  label = '',
  value,
  onChange,
  options,
  containerWidth,
  containerMinWidth = 50,
  containerHeight = 40,
}: {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  containerWidth?: string | number;
  containerMinWidth?: string | number;
  containerHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useHandleClickOutsideRef({
    condition: isOpen,
    outsideClickAction: () => setIsOpen(false),
  });

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label || '',
    [options, value],
  );

  const toggleSelectBox = () => setIsOpen(!isOpen);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        minWidth: containerMinWidth,
        width: containerWidth || 'auto',
      }}
      className='selection-none'
    >
      <SelectContainer
        label={label}
        isOpen={isOpen}
        selectedLabel={selectedLabel}
        toggleSelectBox={toggleSelectBox}
        containerHeight={containerHeight}
      />
      {isOpen && (
        <SelectItems
          options={options}
          selectedValue={value}
          selectValue={(newValue) => {
            onChange(newValue); // 외부 상태 변경
            setIsOpen(false); // 닫기
          }}
        />
      )}
    </Box>
  );
}

function SelectContainer({
  label,
  isOpen,
  selectedLabel,
  toggleSelectBox,
  containerHeight,
}: {
  label?: string;
  isOpen: boolean;
  selectedLabel?: ReactNode;
  toggleSelectBox: () => void;
  containerHeight: number;
}) {
  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
        px: label ? 1.2 : 0.4,
        py: 0.5,
        height: containerHeight,
        backgroundColor: '#ffffff',
        boxShadow: '0 0 3px rgba(50, 50, 50, 0.1)',
        border: '1px solid #cccccc',
        borderRadius: 4,
        cursor: 'pointer',
      }}
      onClick={toggleSelectBox}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {label && (
          <>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 400, color: '#333333' }}>
              {label}
            </Typography>
            <Divider
              orientation='vertical'
              sx={{ height: 20, alignSelf: 'center', backgroundColor: '#cccccc' }}
            />
          </>
        )}
        <Box
          component='span'
          sx={{
            padding: '3px 9px',
            borderRadius: 4,
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {selectedLabel}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
        }}
      >
        <KeyboardArrowDownIcon style={{ fontSize: '1.6rem' }} />
      </Box>
    </Stack>
  );
}

function SelectItems({
  selectValue,
  selectedValue,
  options,
}: {
  selectValue: (value: string | number) => void;
  selectedValue: string | number;
  options: SelectOption[];
}) {
  return (
    <Box
      className='shadow-scroll'
      sx={{
        position: 'absolute',
        top: '115%',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: 6,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxHeight: 300,
        overflowY: 'auto',
        zIndex: SELECT_BOX_ITEM_Z_INDEX,
      }}
    >
      {options.map((option) => (
        <Stack
          key={option.value}
          direction='row'
          alignItems='center'
          sx={{
            height: 40,
            cursor: 'pointer',
            backgroundColor: selectedValue === option.value ? colors.primary[500] : 'transparent',
          }}
          onClick={() => selectValue(option.value)}
        >
          <Box
            component='span'
            sx={{
              ml: 0.6,
              padding: '2px 8px',
              borderRadius: 4,
              color: selectedValue === option.value ? '#ffffff' : '#000000',
            }}
          >
            {option.label}
          </Box>
        </Stack>
      ))}
    </Box>
  );
}
