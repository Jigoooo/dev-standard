import { useState } from 'react';
import { addMonths, format } from 'date-fns';

import {
  Button,
  DateFromToPicker,
  FlexColumn,
  FlexRow,
  ModalLayout,
  SearchButton,
  Table,
  useModal,
  useTableData,
} from '@/shared/ui';
import {
  ExcelUploadModal,
  TFileDownload,
  useExcelUploadDownloadHeaders,
} from '@/entities/excel-upload-download';

export function ExcelUploadDownload() {
  const fileDownloadHeaders = useExcelUploadDownloadHeaders();
  const { dataList, handelDataList } = useTableData<TFileDownload>([]);
  const [fromToDateString, setFromToDateString] = useState({
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const excelUploadModal = useModal();
  const excelUploadModalOpen = () => {
    excelUploadModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 450 }}
          title={'파일 업로드'}
          close={close}
        >
          <ExcelUploadModal />
        </ModalLayout>
      );
    });
  };

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 6,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <FlexRow style={{ gap: 6 }}>
          <DateFromToPicker fromToDateString={fromToDateString} onChange={setFromToDateString} />
          <SearchButton
            onClick={() => {
              console.log('검색');
            }}
          />
        </FlexRow>
        <Button onClick={excelUploadModalOpen}>엑셀 업로드</Button>
      </FlexRow>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: true,
        }}
        tableHeaders={fileDownloadHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </FlexColumn>
  );
}
