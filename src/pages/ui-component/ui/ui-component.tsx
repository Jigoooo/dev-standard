import { useRef, useState } from 'react';

import {
  Button,
  ButtonStyle,
  Checkbox,
  DashedDivider,
  DateFromToPicker,
  DatePicker,
  dialogActions,
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
  Tooltip,
  useModal,
} from '@/shared/components';
import { useKeepAliveScrollHistoryRef, useToggle } from '@/shared/hooks';
import { sleep } from '@/shared/lib';
import { Accordion, AccordionGroup } from '@/shared/components/accordion';

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
  const keepAliveScrollHistoryRef = useKeepAliveScrollHistoryRef(domRef);

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
        <span style={{ width: 200, fontWeight: 500 }}>Button Solid: </span>
        <Button>Button Solid</Button>
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Button Outlined: </span>
        <Button buttonStyle={ButtonStyle.OUTLINED}>Button Outlined</Button>
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

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

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Select: </span>
        <Select
          isAutocomplete={true}
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
        <span style={{ width: 200, fontWeight: 500 }}>Date Picker: </span>
        <DatePicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-04-30')} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Date Range Picker: </span>
        <DateFromToPicker minDate={new Date('2025-02-01')} maxDate={new Date('2025-05-30')} />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Outlined: </span>
        <Input style={{ height: 36 }} placeholder={'Input Outlined'} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Input Underline: </span>
        <Input
          inputStyle={InputStyle.UNDERLINE}
          style={{ height: 36 }}
          placeholder={'Input Underline'}
        />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Textarea: </span>
        <Textarea style={{ width: 300 }} placeholder={'Textarea'} />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Checkbox: </span>
        <Checkbox label={'Checkbox Label'} checked={check} onClick={toggleCheck} />
      </FlexRow>
      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Switch: </span>
        <Switch label={'Switch Label'} isOn={switchValue} onClick={toggleSwitch} />
      </FlexRow>

      <DashedDivider strokeColor={'#666666'} style={{ marginBlock: 16 }} />

      <FlexRow style={{ alignItems: 'center', marginBottom: 16 }}>
        <span style={{ width: 200, fontWeight: 500 }}>Accordion: </span>
        <AccordionGroup style={{ minWidth: 400 }}>
          <Accordion
            title={'Accordion 1'}
            isOpen={accordionStates[0].isOpen}
            toggleAccordion={() => toggleAccordion(accordionStates[0].id)}
          >
            <span style={{ paddingBottom: 16 }}>contents 1</span>
          </Accordion>
          <Accordion
            title={'Accordion 2'}
            isOpen={accordionStates[1].isOpen}
            toggleAccordion={() => toggleAccordion(accordionStates[1].id)}
          >
            <span style={{ paddingBottom: 16 }}>contents 2</span>
          </Accordion>
        </AccordionGroup>
      </FlexRow>

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Tooltip: </span>
        <Tooltip content={'Tooltip'} position={'topRight'}>
          <span style={{ border: '1px solid #bbbbbb', padding: 12, borderRadius: 4 }}>Tooltip</span>
        </Tooltip>
      </FlexRow>

      <FlexRow style={{ alignItems: 'center' }}>
        <span style={{ width: 200, fontWeight: 500 }}>Tooltip: </span>
        <Link>Link</Link>
      </FlexRow>
    </FlexColumn>
  );
}
