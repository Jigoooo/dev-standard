import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card, { CardProps } from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';

import { IconButton } from '@/shared/ui';
import { useSizeMatch } from '@/shared/hooks';

export function FileUploadItem(
  props: CardProps & {
    icon?: React.ReactElement;
    fileName: string;
    fileSize: string;
    progress: number;
    deleteFile: () => void;
  },
) {
  const { icon, fileName, fileSize, deleteFile, progress, sx, ...other } = props;
  const mobileSizeMatches = useSizeMatch('sm');

  return (
    <Card
      variant='outlined'
      orientation='horizontal'
      {...other}
      sx={[
        {
          position: 'relative',
          gap: 1.5,
          alignItems: 'flex-start',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AspectRatio
        ratio='1'
        variant='soft'
        color='neutral'
        sx={{
          minWidth: 32,
          borderRadius: '50%',
          '--Icon-fontSize': '16px',
        }}
      >
        <div>{icon ?? <InsertDriveFileRoundedIcon />}</div>
      </AspectRatio>
      <CardContent sx={{ maxWidth: mobileSizeMatches ? '67vw' : undefined }}>
        <Typography
          sx={[
            mobileSizeMatches && { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
            { maxWidth: '90%' },
          ]}
          fontSize='sm'
        >
          {fileName}
        </Typography>
        <Typography level='body-xs'>{fileSize}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            color='neutral'
            value={progress}
            determinate
            sx={[
              {
                ...(progress < 100 && {
                  color: 'var(--joy-palette-success-solidBg)',
                }),
              },
            ]}
          />
          <Typography fontSize='xs'>{progress}%</Typography>
        </Box>
      </CardContent>

      <IconButton
        color={'neutral'}
        sx={{ position: 'absolute', zIndex: 1, top: 0, right: 0, px: 1, py: 1 }}
        onClick={deleteFile}
      >
        <ClearIcon />
      </IconButton>
    </Card>
  );
}
