import {
  Button,
  ButtonStyle,
  FlexColumn,
  FlexRow,
  Input,
  InputStyle,
  ModalLayout,
  MultiSelect,
  Select,
  useModal,
} from '@/shared/components';
import { useState } from 'react';

export function UiComponent() {
  const [select, setSelect] = useState('1');
  const [multiSelect, setMultiSelect] = useState(['1', '2']);

  const modal = useModal();
  const openModal = () => {
    modal.open(({ close }) => {
      return (
        <ModalLayout title={'Modal Title'} close={close}>
          <span>Modal Contents</span>
        </ModalLayout>
      );
    });
  };

  return (
    <FlexColumn
      style={{
        height: '100%',
        gap: 16,
      }}
    >
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Button Solid: </span>
        <Button>Button Solid</Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Button Outlined: </span>
        <Button buttonStyle={ButtonStyle.OUTLINED}>Button Outlined</Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Open modal: </span>
        <Button onClick={openModal} style={{ backgroundColor: '#5ba2ed' }}>
          Open modal
        </Button>
      </FlexRow>

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Outlined: </span>
        <Input style={{ height: 36 }} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Underline: </span>
        <Input inputStyle={InputStyle.UNDERLINE} style={{ height: 36 }} />
      </FlexRow>

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Select: </span>
        <Select
          label={'Select'}
          value={select}
          onChange={setSelect}
          options={[
            { value: '1', label: 'Select 1' },
            { value: '2', label: 'Select 2' },
            { value: '3', label: 'Select 3' },
          ]}
        />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Multi Select: </span>
        <MultiSelect
          label={'Multi Select'}
          values={multiSelect}
          onChange={setMultiSelect}
          options={[
            { value: '1', label: 'Select 1' },
            { value: '2', label: 'Select 2' },
            { value: '3', label: 'Select 3' },
          ]}
        />
      </FlexRow>
    </FlexColumn>
  );
}
