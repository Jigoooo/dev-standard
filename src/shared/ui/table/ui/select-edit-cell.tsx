import { TEditCell } from '@/shared/ui/table/model/table-type.ts';
import { Select, SelectOption } from '@/shared/ui';

export function SelectEditCell<TData>({
  options,
  cellData,
  setCellData,
  setEditType,
  exitEditMode,
}: TEditCell<TData> & {
  options: SelectOption<typeof cellData>[];
}) {
  const OptionValueByLabel = options.find((option) => option.label === cellData)?.value || '';

  return (
    <Select
      containerMinWidth={0}
      strategy={'fixed'}
      isAutocomplete={true}
      value={OptionValueByLabel}
      onChange={(value) => {
        const OptionLabelByValue = options.find((option) => option.value === value)?.label || '';
        setCellData(OptionLabelByValue);

        setTimeout(() => {
          exitEditMode();
        }, 100);
      }}
      openListener={(isOpen) => {
        if (isOpen) {
          setEditType('select');
        } else {
          setEditType('none');
        }
      }}
      options={options}
    />
  );
}
