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
  FileUploadModal,
  TFileDownload,
  useFileUploadDownloadHeaders,
} from '@/entities/file-upload-download';
import { useGetFileList } from '@/entities/file-upload-download/api';

export function FileUploadDownload() {
  const fileDownloadHeaders = useFileUploadDownloadHeaders();
  const { dataList, handelDataList, deleteDataList } = useTableData<TFileDownload>([]);
  const [fromToDateString, setFromToDateString] = useState({
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const getFileListQuery = useGetFileList();
  console.log(getFileListQuery.data?.data);

  const fileUploadModal = useModal();
  const fileUploadModalOpen = () => {
    fileUploadModal.open(({ overlayRef, close }) => {
      return (
        <ModalLayout
          overlayRef={overlayRef}
          containerStyle={{ width: 800, height: 900 }}
          title={'파일 업로드'}
          close={close}
        >
          <FileUploadModal />
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
        <Button onClick={fileUploadModalOpen}>파일 업로드</Button>
      </FlexRow>
      <Table
        tableStyle={{
          showVerticalLines: true,
          tableContainerAutoWidth: true,
        }}
        tableHeaders={fileDownloadHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        deleteDataList={deleteDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </FlexColumn>
  );
}
