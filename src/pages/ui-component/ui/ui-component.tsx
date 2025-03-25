import { useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  ButtonStyle,
  Checkbox,
  DashedDivider,
  DateFromToPicker,
  DatePicker,
  dialog,
  FlexColumn,
  FlexRow,
  Input,
  InputStyle,
  Link,
  loadingAction,
  ModalLayout,
  MultiSelect,
  Select,
  Switch,
  Textarea,
  TimePicker,
  Tooltip,
  Typography,
  useModal,
} from '@/shared/ui';
import { useKeepAliveScrollHistoryRef, useToggle } from '@/shared/hooks';
import { sleep } from '@/shared/lib';
import { Accordion, AccordionGroup } from '@/shared/ui/accordion';

export function UiComponent() {
  const [check, toggleCheck] = useToggle();
  const [switchValue, toggleSwitch] = useToggle();
  const [select, setSelect] = useState('1');
  const [multiSelect, setMultiSelect] = useState(['1', '2']);
  const [accordionStates, setAccordionStates] = useState([
    {
      id: '1',
      isOpen: false,
    },
    {
      id: '2',
      isOpen: false,
    },
  ]);

  const domRef = useRef<HTMLDivElement>(null);
  const keepAliveScrollHistoryRef = useKeepAliveScrollHistoryRef({ ref: domRef });

  const toggleAccordion = (id: string) => {
    setAccordionStates((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isOpen: !item.isOpen,
          };
        }
        return item;
      });
    });
  };

  const modal = useModal({
    isPossibleOverlayClose: true,
  });
  const openModal = () => {
    modal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout title={'Modal Title'} overlayRef={overlayRef} close={close}>
          <Typography>Modal Contents</Typography>
        </ModalLayout>
      );
    });
  };

  return (
    <FlexColumn
      ref={keepAliveScrollHistoryRef}
      style={{
        height: '100%',
        gap: 16,
        paddingBlock: 32,
        paddingInline: 32,
        overflowY: 'auto',
      }}
    >
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Button Solid: </Typography>
        <Button>Button Solid</Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Button Outlined: </Typography>
        <Button buttonStyle={ButtonStyle.OUTLINED}>Button Outlined</Button>
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Open modal: </Typography>
        <Button
          onClick={() => {
            toast.success('Event has been created', {
              duration: 3000,
            });
          }}
          style={{ backgroundColor: '#5ba2ed' }}
        >
          Open Snackbar
        </Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Open modal: </Typography>
        <Button onClick={openModal} style={{ backgroundColor: '#5ba2ed' }}>
          Open modal
        </Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Open dialog: </Typography>
        <Button
          onClick={() => {
            dialog.info({
              title: 'Dialog Title',
              contents: 'Dialog Contents',
              withCancel: true,
              overlayClose: true,
            });
          }}
          style={{ backgroundColor: '#ec6e6e' }}
        >
          Open dialog
        </Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Show loading: </Typography>
        <Button
          onClick={async () => {
            loadingAction.show({
              loadingText: 'Loading...',
            });

            await sleep(4000);

            loadingAction.hide();
          }}
          style={{ backgroundColor: '#6f9e28' }}
        >
          Show loading
        </Button>
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Select: </Typography>
        <Select
          isAutocomplete={true}
          label={'Select Label'}
          value={select}
          onChange={setSelect}
          options={[
            { value: '1', label: 'Select 1' },
            { value: '2', label: 'Select 2' },
            { value: '3', label: 'Select 3' },
            { value: '4', label: 'Select 4' },
            { value: '5', label: 'Select 5' },
            { value: '6', label: 'Select 6' },
            { value: '7', label: 'Select 7' },
            { value: '8', label: 'Select 8' },
            { value: '9', label: 'Select 9' },
            { value: '10', label: 'Select 10' },
            { value: '11', label: 'Select 11' },
            { value: '12', label: 'Select 12' },
            { value: '13', label: 'Select 13' },
            { value: '14', label: 'Select 14' },
            { value: '15', label: 'Select 15' },
          ]}
        />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Multi Select: </Typography>
        <MultiSelect
          isAutocomplete={true}
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
        <Typography style={{ width: 200, fontWeight: 500 }}>Date Picker: </Typography>
        <DatePicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-04-30')} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Date Range Picker: </Typography>
        <DateFromToPicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-05-30')} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Time Picker: </Typography>
        <TimePicker
          timeFormat={'HH:mm:ss'}
          displayParts={['hours', 'minutes', 'seconds']}
          onChange={(timeString) => {
            console.log(timeString);
          }}
        />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Input Outlined: </Typography>
        <Input placeholder={'Input Outlined'} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Input Underline: </Typography>
        <Input inputStyle={InputStyle.UNDERLINE} placeholder={'Input Underline'} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Textarea: </Typography>
        <Textarea style={{ width: 300 }} placeholder={'Textarea'} />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Checkbox: </Typography>
        <Checkbox label={'Checkbox Label'} checked={check} onClick={toggleCheck} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Switch: </Typography>
        <Switch label={'Switch Label'} isOn={switchValue} onClick={toggleSwitch} />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center', marginBottom: 16 }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Accordion: </Typography>
        <AccordionGroup style={{ minWidth: 400 }}>
          <Accordion
            title={'Accordion 1'}
            isOpen={accordionStates[0].isOpen}
            toggleAccordion={() => toggleAccordion(accordionStates[0].id)}
          >
            <Typography style={{ paddingBottom: 16 }}>contents 1</Typography>
          </Accordion>
          <Accordion
            title={'Accordion 2'}
            isOpen={accordionStates[1].isOpen}
            toggleAccordion={() => toggleAccordion(accordionStates[1].id)}
          >
            <Typography style={{ paddingBottom: 16 }}>contents 2</Typography>
          </Accordion>
        </AccordionGroup>
      </FlexRow>

      <FlexRow style={{ alignItems: 'center' }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Tooltip: </Typography>
        <Tooltip content={'Tooltip'} placement={'top'}>
          <FlexRow
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #bbbbbb',
              padding: 4,
              width: 100,
              borderRadius: 4,
            }}
          >
            <Typography>Tooltip</Typography>
          </FlexRow>
        </Tooltip>
      </FlexRow>

      <FlexRow style={{ alignItems: 'center', marginTop: 16 }}>
        <Typography style={{ width: 200, fontWeight: 500 }}>Link: </Typography>
        <Link>Link</Link>
      </FlexRow>
    </FlexColumn>
  );
}
