import {
  FlexColumn,
  FlexRow,
  Button,
  useModal,
  ModalLayout,
  useTableData,
  Table,
} from '@/shared/components';
import { FileUploadModal } from '@/entities/file-upload-download';
import { useEffect } from 'react';
import {
  generateUsers,
  gridExampleHeaderGroups,
  gridExampleHeaders,
} from '@/entities/grid-example';

export function FileUploadDownload() {
  const { dataList, setDataList, handelDataList } = useTableData<{
    index: string;
    check: boolean;
    name: string;
    email: string;
    age: number;
    address: string;
    phone: string;
    jobTitle: string;
    department: string;
    salary: number;
    hireDate: string;
  }>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      const allUsers = [];

      for await (const batch of generateUsers({
        total: 10000,
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
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <FlexRow>
        <Button onClick={fileUploadModalOpen}>파일 업로드</Button>
      </FlexRow>
      <Table
        tableHeaderGroups={gridExampleHeaderGroups}
        tableHeaders={gridExampleHeaders}
        tableDataList={dataList}
        handelDataList={handelDataList}
        handleSyncCheckList={(checkedList) => {
          console.log(checkedList);
        }}
      />
    </FlexColumn>
  );
}
