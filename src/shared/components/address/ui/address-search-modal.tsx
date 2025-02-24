import DaumPostcodeEmbed from 'react-daum-postcode';
import { Address } from 'react-daum-postcode/lib/loadPostcode';
import { FaRegAddressCard } from 'react-icons/fa6';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { useColorScheme } from '@mui/joy/styles';

import { AnimatedModal, closeModal, ModalType } from '@/shared/components';
import { colors } from '@/shared/constants';

interface FuturAddressSearchModalProps {
  setAddressData: (addressData: Address) => void;
}

export function AddressSearchModal({ setAddressData }: Readonly<FuturAddressSearchModalProps>) {
  const { mode } = useColorScheme();

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    data.address = fullAddress;

    setAddressData(data);
    closeModal(ModalType.ADDRESS);
  };

  return (
    <AnimatedModal open={false} onClose={() => closeModal(ModalType.ADDRESS)} keepMounted={false}>
      <>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FaRegAddressCard />
            <Typography paddingLeft={1}>주소검색</Typography>
          </Box>
          <ModalClose variant='outlined' />
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DaumPostcodeEmbed
            style={{
              width: 'clamp(50vw, (var(--Collapsed-login-breakpoint) - 100vw) * 999, 70vw)',
              height: '90svh',
              transition: 'width var(--Transition-duration)',
            }}
            animation={true}
            onComplete={handleComplete}
            theme={mode === 'dark' ? colors.daumPostCodeBlackTheme : undefined}
            showMoreHName={true}
          />
        </DialogContent>
      </>
    </AnimatedModal>
  );
}
