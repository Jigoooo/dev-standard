import { useEffect, useRef } from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { Input } from '@/shared/ui';

export function EditableText({
  label,
  value,
  onChange,
  isEditing,
  toggleEditing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  toggleEditing: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      toggleEditing();
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  return (
    <Stack sx={{ flex: 1 }}>
      <Typography sx={{ color: '#777777', fontSize: '0.9rem' }}>{label}</Typography>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            autoFocus={true}
            style={{
              minHeight: 0,
              height: 30,
              fontSize: '0.92rem',
              fontWeight: 600,
              paddingLeft: 6,
            }}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <Typography
            sx={{
              color: '#000000',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: '#eeeeee',
              },
              transition: 'all 0.1s',
              cursor: 'pointer',
            }}
            onClick={toggleEditing}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
