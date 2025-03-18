import { useEffect, useState } from 'react';

import {
  Button,
  DateFromToPicker,
  dialogActions,
  DialogType,
  FlexColumn,
  FlexRow,
  SearchButton,
  Table,
  TDataWithIndex,
  useTableData,
} from 'shared/ui';
import {
  useGetMemberListQuery,
  useGetMenuMemberAuthListQuery,
  useUpdateMenuMemberAuthMutation,
  useRoleManagementHeaders,
  RMenuMemberAuth,
  RRoleUser,
} from '@/entities/router';
import { toast } from 'sonner';

export function RoleManagement() {
  // const { currentMenuMemberAuth } = useRouterMenuContext();
  // console.log(currentMenuMemberAuth);

  const { roleUserHeaders, roleManagementHeaders } = useRoleManagementHeaders();
  const { dataList, setDataList, handelDataList, deleteDataList } = useTableData<
    TDataWithIndex & RRoleUser
  >([]);
  const {
    dataList: menuAuthList,
    setDataList: setMenuAuthList,
    handelDataList: handelMenuAuthList,
    deleteDataList: deleteMenuAuthList,
  } = useTableData<TDataWithIndex & RMenuMemberAuth>([]);

  const [memberId, setMemberId] = useState('');

  const getMemberListQuery = useGetMemberListQuery();
  const getMenuMemberAuthListQuery = useGetMenuMemberAuthListQuery({
    memberId,
  });
  const updateMenuMemberAuthMutation = useUpdateMenuMemberAuthMutation();

  useEffect(() => {
    if (getMemberListQuery.data?.data?.menuList) {
      const dataWithIndex = getMemberListQuery.data.data.menuList.map((item, index) => {
        return {
          ...item,
          index: (index + 1).toString(),
        };
      });
      setDataList(dataWithIndex);
    }
  }, [getMemberListQuery.data?.data?.menuList]);
  useEffect(() => {
    if (getMenuMemberAuthListQuery.data?.data?.menuList) {
      const dataWithIndex = getMenuMemberAuthListQuery.data.data.menuList.map((item, index) => {
        const isAllChecked =
          item.useYn === 'Y' &&
          item.authIns === 'Y' &&
          item.authDel === 'Y' &&
          item.authSearch === 'Y' &&
          item.authMod === 'Y' &&
          item.excelExport === 'Y';

        return {
          ...item,
          index: (index + 1).toString(),
          allChecked: isAllChecked,
        };
      });
      setMenuAuthList(dataWithIndex);
    }
  }, [getMenuMemberAuthListQuery.data?.data?.menuList]);

  const updateMenuMemberAuth = () => {
    dialogActions.open({
      title: '권한을 수정하시겠습니까?',
      withCancel: true,
      overlayClose: true,
      onConfirm: () => {
        updateMenuMemberAuthMutation.mutate(menuAuthList, {
          onSuccess: (data) => {
            if (!data.success) {
              console.log(data);
              dialogActions.open({
                dialogType: DialogType.ERROR,
                title: '권한 저장에 실패하였습니다.',
                contents: data.msg ?? '관리자에게 문의해 주세요.',
              });

              return;
            }

            toast.success('권한이 수정되었습니다.', {
              duration: 2000,
            });
          },
        });
      },
    });
  };

  return (
    <FlexColumn
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
        gap: 6,
      }}
    >
      <FlexRow
        style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 6,
          paddingRight: 14,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          height: 65,
        }}
      >
        {memberId !== '' && (
          <Button style={{ width: 80 }} onClick={updateMenuMemberAuth}>
            저장
          </Button>
        )}
      </FlexRow>

      <FlexRow style={{ height: '100%', gap: 12 }}>
        <Table
          tableStyle={{
            showVerticalLines: true,
          }}
          tableRowClick={(data) => {
            setMemberId(data.memberId);
          }}
          tableHeaders={roleUserHeaders}
          tableDataList={dataList}
          handelDataList={handelDataList}
          deleteDataList={deleteDataList}
        />
        <Table
          tableStyle={{
            showVerticalLines: true,
            tableContainerAutoWidth: true,
          }}
          tableHeaders={roleManagementHeaders}
          filterRowEnabled={false}
          tableDataList={menuAuthList}
          handelDataList={handelMenuAuthList}
          deleteDataList={deleteMenuAuthList}
        />
      </FlexRow>
    </FlexColumn>
  );
}
