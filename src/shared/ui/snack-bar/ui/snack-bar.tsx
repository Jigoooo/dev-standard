// import ReportIcon from '@mui/icons-material/Report';
// import WarningIcon from '@mui/icons-material/Warning';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import InfoIcon from '@mui/icons-material/Info';
//
// import {
//   hideSnackBar,
//   SnackBarType,
//   useSnackBarInfo,
//   useSnackBarOpenState,
// } from '@/shared/components/snack-bar';
// import { SNACK_BAR_Z_INDEX } from '@/shared/constants';
//
// export function SnackBar() {
//   const open = useSnackBarOpenState();
//   const { message, duration, type } = useSnackBarInfo();
//
//   const autoHideDuration = duration ?? 3000;
//
//   return (
//     <>
//       <Snackbar
//         sx={{ zIndex: SNACK_BAR_Z_INDEX, backgroundColor: '#414141', color: '#ffffff' }}
//         variant={'solid'}
//         open={open}
//         autoHideDuration={autoHideDuration}
//         onClose={(_event, reason) => {
//           if (type === 'loading' && reason === 'clickaway') {
//             return;
//           }
//
//           hideSnackBar();
//         }}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         startDecorator={getIcon(type)}
//         endDecorator={
//           type !== 'loading' && !autoHideDuration ? (
//             <Button onClick={hideSnackBar} size='sm' variant='soft' color='neutral'>
//               닫기
//             </Button>
//           ) : (
//             <></>
//           )
//         }
//       >
//         {message}
//       </Snackbar>
//     </>
//   );
// }
//
// const getIcon = (type?: SnackBarType) => {
//   if (type === SnackBarType.LOADING) {
//     return <CircularProgress color='primary' />;
//   }
//
//   switch (type) {
//     case SnackBarType.ERROR:
//       return <ReportIcon sx={{ color: '#f14242' }} />;
//     case SnackBarType.WARNING:
//       return <WarningIcon sx={{ color: '#f67a45' }} />;
//     case SnackBarType.SUCCESS:
//       return <CheckCircleIcon sx={{ color: '#4ced34' }} />;
//     case SnackBarType.INFO:
//     default:
//       return <InfoIcon />;
//   }
// };
