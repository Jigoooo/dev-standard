import {
  Button,
  ButtonStyle,
  Checkbox,
  DashedDivider,
  DateFromToPicker,
  DatePicker,
  dialogActions,
  Divider,
  FlexColumn,
  FlexRow,
  Input,
  InputStyle,
  loadingAction,
  ModalLayout,
  MultiSelect,
  Select,
  Switch,
  Textarea,
  Tooltip,
  useModal,
} from '@/shared/components';
import { useState } from 'react';
import { useToggle } from '@/shared/hooks';
import { sleep } from '@/shared/lib';

export function UiComponent() {
  const [check, toggleCheck] = useToggle();
  const [switchValue, toggleSwitch] = useToggle();
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
        paddingBlock: 32,
        paddingInline: 32,
        overflowY: 'auto',
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

      <Divider style={{ marginBlock: 16, backgroundColor: '#bbbbbb' }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Open modal: </span>
        <Button onClick={openModal} style={{ backgroundColor: '#5ba2ed' }}>
          Open modal
        </Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Open dialog: </span>
        <Button
          onClick={() => {
            dialogActions.openDialog({
              title: 'Dialog Title',
              contents: 'Dialog Contents',
              withCancel: true,
            });
          }}
          style={{ backgroundColor: '#ec6e6e' }}
        >
          Open dialog
        </Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Show loading: </span>
        <Button
          onClick={async () => {
            loadingAction.showLoading({
              loadingText: 'Loading...',
            });

            await sleep(3000);

            loadingAction.hideLoading();
          }}
          style={{ backgroundColor: '#6f9e28' }}
        >
          Show loading
        </Button>
      </FlexRow>

      <Divider style={{ marginBlock: 16, backgroundColor: '#bbbbbb' }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Outlined: </span>
        <Input style={{ height: 36 }} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Underline: </span>
        <Input inputStyle={InputStyle.UNDERLINE} style={{ height: 36 }} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Textarea: </span>
        <Textarea style={{ width: 300 }} />
      </FlexRow>

      <Divider style={{ marginBlock: 16, backgroundColor: '#bbbbbb' }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Select: </span>
        <Select
          label={'Select Label'}
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
          label={'Multi Select Label'}
          values={multiSelect}
          onChange={setMultiSelect}
          options={[
            { value: '1', label: 'Select 1' },
            { value: '2', label: 'Select 2' },
            { value: '3', label: 'Select 3' },
          ]}
        />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Date Picker: </span>
        <DatePicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-03-30')} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Date Range Picker: </span>
        <DateFromToPicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-03-30')} />
      </FlexRow>

      <Divider style={{ marginBlock: 16, backgroundColor: '#bbbbbb' }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Checkbox: </span>
        <Checkbox label={'Checkbox Label'} checked={check} onClick={toggleCheck} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Switch: </span>
        <Switch label={'Switch Label'} isOn={switchValue} onClick={toggleSwitch} />
      </FlexRow>

      <Divider style={{ marginBlock: 16, backgroundColor: '#bbbbbb' }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Dashed Divider: </span>
        <DashedDivider strokeColor={'red'} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Tooltip: </span>
        <Tooltip content={'Tooltip'} position={'topRight'}>
          <span style={{ border: '1px solid #bbbbbb', padding: 12, borderRadius: 4 }}>Tooltip</span>
        </Tooltip>
      </FlexRow>
    </FlexColumn>
  );
}
