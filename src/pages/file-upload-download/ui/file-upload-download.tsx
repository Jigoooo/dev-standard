import {
  FlexColumn,
  FlexRow,
  Button,
  useModal,
  ModalLayout,
  useTableData,
  Table,
} from '@/shared/components';
import {
  fileDownloadHeaders,
  FileUploadModal,
  generateFileUploads,
  TFileDownload,
} from '@/entities/file-upload-download';
import { useEffect } from 'react';

// 테이블 상단 버튼
// 테이블 세로선 옵션
// 테이블 헤더 세로선 뚜렷하게
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
      <FlexRow>
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
