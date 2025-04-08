import type { Address } from 'react-daum-postcode/lib/loadPostcode';

interface FuturAddressSearchModalProps {
  setAddressData: (addressData: Address) => void;
}

export function AddressSearchModal({ setAddressData }: Readonly<FuturAddressSearchModalProps>) {
  console.log(setAddressData);
  // const { mode } = useColorScheme();

  // const handleComplete = (data: Address) => {
  //   let fullAddress = data.address;
  //   let extraAddress = '';
  //
  //   if (data.addressType === 'R') {
  //     if (data.bname !== '') {
  //       extraAddress += data.bname;
  //     }
  //     if (data.buildingName !== '') {
  //       extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
  //     }
  //     fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
  //   }
  //
  //   data.address = fullAddress;
  //
  //   setAddressData(data);
  //   closeModal(ModalType.ADDRESS);
  // };

  return (
    // <AnimatedModal open={false} onClose={() => closeModal(ModalType.ADDRESS)} keepMounted={false}>
    <>
      {/*<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>*/}
      {/*  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>*/}
      {/*    <FaRegAddressCard />*/}
      {/*    <Typography paddingLeft={1}>주소검색</Typography>*/}
      {/*  </Box>*/}
      {/*  <ModalClose variant='outlined' />*/}
      {/*</DialogTitle>*/}
      {/*<Divider />*/}
      {/*<DialogContent>*/}
      {/*  <DaumPostcodeEmbed*/}
      {/*    style={{*/}
      {/*      width: 'clamp(50vw, (var(--Collapsed-login-breakpoint) - 100vw) * 999, 70vw)',*/}
      {/*      height: '90svh',*/}
      {/*      transition: 'width var(--Transition-duration)',*/}
      {/*    }}*/}
      {/*    animation={true}*/}
      {/*    onComplete={handleComplete}*/}
      {/*    theme={mode === 'dark' ? colors.daumPostCodeBlackTheme : undefined}*/}
      {/*    showMoreHName={true}*/}
      {/*  />*/}
      {/*</DialogContent>*/}
    </>
    // </AnimatedModal>
  );
}
