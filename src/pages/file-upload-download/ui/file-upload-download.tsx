import { useEffect } from 'react';

import {
  FlexColumn,
  FlexRow,
  Button,
  useModal,
  ModalLayout,
  useTableData,
  Table,
  DateFromToPicker,
} from '@/shared/components';
import {
  fileDownloadHeaders,
  FileUploadModal,
  generateFileUploads,
  TFileDownload,
} from '@/entities/file-upload-download';

// 메뉴 뎁스 구현
// 테이블 상단 버튼
export function FileUploadDownload() {
  const { dataList, setDataList, handelDataList } = useTableData<TFileDownload>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      const allUsers = [];

      for await (const batch of generateFileUploads({
        total: 10,
      })) {
        allUsers.push(...batch);

        if (isMounted) {
          setDataList((prev) => [...prev, ...batch]);
        }
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

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
          paddingBlock: 12,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <DateFromToPicker />
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
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </FlexColumn>
  );
}
