import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Box, Link } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

export function PageBackWithHeader() {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pb: 3,
      }}
    >
      <ArrowBackOutlinedIcon sx={{ color: '#777777', strokeWidth: 1, stroke: '#777777' }} />
      <Link
        sx={{ color: '#777777', textDecorationColor: '#777777', fontWeight: 700 }}
        onClick={back}
      >
        뒤로가기
      </Link>
    </Box>
  );
}
