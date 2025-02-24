import { Box, Typography } from '@mui/joy';
import { motion } from 'framer-motion';
import { SxProps } from '@mui/joy/styles/types';

interface FramerMotionSwitchProps {
  containerSx?: SxProps;
  label?: string;
  labelSx?: SxProps;
  isOn: boolean;
  onClick: () => void;
  width?: number;
  height?: number;
}

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30,
};

export function FuturFramerMotionSwitch({
  containerSx,
  label,
  labelSx,
  isOn,
  onClick,
  width = 40,
  height = 21,
}: FramerMotionSwitchProps) {
  return (
    <Box
      sx={[
        { display: 'flex', justifyContent: 'space-between' },
        ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
      ]}
    >
      {label && (
        <Typography sx={[{ fontSize: '0.875rem', fontWeight: 600 }, ...(Array.isArray(labelSx) ? labelSx : [labelSx])]}>
          {label}
        </Typography>
      )}
      <Box
        style={{
          display: 'flex',
          width,
          height,
          borderRadius: '50px',
          backgroundColor: isOn ? 'black' : 'grey',
          padding: height / 7,
          cursor: 'pointer',
          justifyContent: isOn ? 'flex-end' : 'flex-start',
        }}
        onClick={onClick}
      >
        <motion.div
          layout
          transition={spring}
          style={{
            width: width / 2.3,
            height: height - height / 4,
            backgroundColor: 'white',
            borderRadius: height - height / 4,
          }}
        />
      </Box>
    </Box>
  );
}
