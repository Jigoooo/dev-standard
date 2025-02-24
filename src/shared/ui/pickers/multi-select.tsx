import { ReactNode, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/joy';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';

import { Checkbox } from '@/shared/ui';
import { colors, SELECT_BOX_ITEM_Z_INDEX } from '@/shared/constants';
import { useHandleClickOutsideRef } from '@/shared/hooks';

type SelectOption = {
  key: string | number;
  value: ReactNode;
};

export function MultiSelect({
  label = '',
  value,
  onChange,
  options,
  containerHeight = 38,
}: {
  label?: string;
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  options: SelectOption[];
  containerHeight?: number;
}) {
  const [selectedAreas, setSelectedAreas] = useState<(string | number)[]>(() =>
    options
      .map((area) => area.key)
      .filter((area) => {
        if (value) {
          return value.includes(area);
        }
        return area;
      }),
  );

  const [isOpen, setIsOpen] = useState(false);

  const ref = useHandleClickOutsideRef({
    condition: isOpen,
    outsideClickAction: () => setIsOpen(false),
  });

  const toggleSelectBox = () => {
    setIsOpen(!isOpen);
  };

  const toggleArea = (key: string | number) => {
    setSelectedAreas((prevState) => {
      const newState = prevState.includes(key)
        ? prevState.filter((area) => area !== key)
        : [...prevState, key];
      if (onChange) {
        onChange(newState);
      }
      return newState;
    });
  };

  const clearAreas = () => {
    if (selectedAreas.length > 0) {
      setSelectedAreas([]);
      if (onChange) {
        onChange([]);
      }
      if (isOpen) {
        toggleSelectBox();
      }
    }
  };

  return (
    <Box ref={ref} sx={{ position: 'relative', minWidth: 100 }} className={'selection-none'}>
      <MultiSelectContainer
        label={label}
        isOpen={isOpen}
        options={options}
        selectedAreas={selectedAreas}
        clearAreas={clearAreas}
        toggleSelectBox={toggleSelectBox}
        containerHeight={containerHeight}
      />
      {isOpen && (
        <MultiSelectItems options={options} selectedAreas={selectedAreas} toggleArea={toggleArea} />
      )}
    </Box>
  );
}

function MultiSelectContainer({
  label,
  isOpen,
  options,
  selectedAreas,
  clearAreas,
  toggleSelectBox,
  containerHeight,
}: {
  label: string;
  isOpen: boolean;
  options: SelectOption[];
  selectedAreas: (string | number)[];
  clearAreas: () => void;
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
        pl: 1.2,
        pr: 0.5,
        py: 0.5,
        height: containerHeight,
        backgroundColor: '#ffffff',
        boxShadow: '0 0 3px rgba(50, 50, 50, 0.1)',
        border: '1px solid #ddd',
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
              orientation={'vertical'}
              sx={{ height: 20, alignSelf: 'center', backgroundColor: '#cccccc' }}
            />
          </>
        )}
        {selectedAreas.length === options.length || selectedAreas.length === 0 ? (
          <>
            <Box
              component='span'
              sx={{
                padding: '3px 9px',
                borderRadius: 4,
                backgroundColor: colors.primary[100],
                color: colors.primary[500],
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              전체
            </Box>
            <Typography sx={{ fontSize: '1rem' }}> 선택됨</Typography>
          </>
        ) : selectedAreas.length > 4 ? (
          <>
            <Box
              component='span'
              sx={{
                padding: '3px 9px',
                borderRadius: 4,
                backgroundColor: colors.primary[100],
                color: colors.primary[500],
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {selectedAreas.length}
            </Box>
            <Typography sx={{ fontSize: '1rem' }}> 선택됨</Typography>
          </>
        ) : (
          selectedAreas.map((key) => (
            <Box key={key} component={'span'}>
              {options.find((option) => option.key === key)?.value}
            </Box>
          ))
        )}
      </Box>
      {selectedAreas.length > 0 && selectedAreas.length !== options.length && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 0.8,
          }}
          onClick={(event) => {
            event.stopPropagation();
            clearAreas();
          }}
        >
          <ClearIcon sx={{ fontSize: '1rem' }} />
        </Box>
      )}
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

function MultiSelectItems({
  toggleArea,
  selectedAreas,
  options,
}: {
  options: SelectOption[];
  selectedAreas: (string | number)[];
  toggleArea: (key: string | number) => void;
}) {
  return (
    <Box
      className={'shadow-scroll'}
      sx={{
        position: 'absolute',
        top: '115%',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxHeight: 300,
        overflowY: 'auto',
        zIndex: SELECT_BOX_ITEM_Z_INDEX,
      }}
    >
      {options.map((option) => (
        <Stack
          key={option.key}
          direction='row'
          alignItems='center'
          sx={{ p: 1, cursor: 'pointer' }}
          onClick={() => toggleArea(option.key)}
        >
          <Checkbox
            checked={selectedAreas.includes(option.key)}
            onClick={() => {
              toggleArea(option.key);
            }}
          />
          <Box
            component='span'
            sx={{
              ml: 1,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {option.value}
          </Box>
        </Stack>
      ))}
      {/*<Stack*/}
      {/*  alignItems='center'*/}
      {/*  sx={{*/}
      {/*    py: 1,*/}
      {/*    cursor: 'pointer',*/}
      {/*    position: 'sticky',*/}
      {/*    bottom: 0,*/}
      {/*    backgroundColor: 'white',*/}
      {/*  }}*/}
      {/*  onClick={clearAreas}*/}
      {/*>*/}
      {/*  <Divider />*/}
      {/*  <Box*/}
      {/*    component='span'*/}
      {/*    sx={{*/}
      {/*      padding: '2px 8px',*/}
      {/*      borderRadius: 4,*/}
      {/*      fontSize: '1rem',*/}
      {/*      fontWeight: 500,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    선택해제*/}
      {/*  </Box>*/}
      {/*</Stack>*/}
    </Box>
  );
}
