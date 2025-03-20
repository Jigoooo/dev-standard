import { TEditCell } from '../model/table-type.ts';
import { DatePicker } from '@/shared/ui';

export function DateEditCell<TData>({
  cellData,
  setCellData,
  setEditType,
  exitEditMode,
}: TEditCell<TData>) {
  console.log(cellData);
  return (
    <DatePicker
      width={'100%'}
      dateFormat={'yyyyMMdd'}
      strategy={'fixed'}
      dateString={cellData ? cellData.toString() : undefined}
      onChange={(dateString) => {
        setCellData(dateString);
        setTimeout(() => {
          exitEditMode();
        }, 100);
      }}
      openListener={(isShowDatePicker) => {
        if (isShowDatePicker) {
          setEditType('date');
        } else {
          setEditType('none');
        }
      }}
    />
  );
}
