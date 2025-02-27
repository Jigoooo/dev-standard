import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/shared/components';

export function PageBackWithHeader() {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 24,
      }}
    >
      <ArrowBackOutlinedIcon sx={{ color: '#777777', strokeWidth: 1, stroke: '#777777' }} />
      <Link style={{ color: '#777777', fontWeight: 700 }} onClick={back}>
        뒤로가기
      </Link>
    </div>
  );
}
