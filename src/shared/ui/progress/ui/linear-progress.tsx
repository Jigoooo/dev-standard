import { motion } from 'framer-motion';

import { FlexRow, Typography } from '@/shared/ui';
import { LinearProgressProps } from '../model/progress-type.ts';

export function LinearProgress({
  progress,
  height = 8,
  backgroundColor = '#e0e0e0',
  progressColor = '#007bff',
}: LinearProgressProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const displayedPercentage = (clampedProgress * 100).toFixed(1);

  return (
    <FlexRow style={{ width: '100%', alignItems: 'center', gap: 10 }}>
      <FlexRow
        as={motion.div}
        style={{
          height,
          width: '100%',
          backgroundColor,
          borderRadius: height,
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            backgroundColor: progressColor,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </FlexRow>
      <Typography style={{ fontWeight: 500, fontSize: '0.9rem' }}>
        {displayedPercentage}%
      </Typography>
    </FlexRow>
  );
}
