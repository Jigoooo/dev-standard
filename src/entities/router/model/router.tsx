import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { RxComponent1 } from 'react-icons/rx';
import { GoTable } from 'react-icons/go';
import { FaRegFile } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { IoPersonCircleOutline } from 'react-icons/io5';

import { Router, TMenu } from './router-type.ts';
import { RouteErrorPage } from '@/shared/components';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { IconType } from 'react-icons';

const MyProfile = lazy(() =>
  import('@/pages/my-profile').then((module) => ({ default: module.MyProfile })),
);
const UiComponent = lazy(() =>
  import('@/pages/ui-component').then((module) => ({ default: module.UiComponent })),
);
const GridExample = lazy(() =>
  import('@/pages/grid-example').then((module) => ({ default: module.GridExample })),
);
const FileUploadDownload = lazy(() =>
  import('@/pages/file-upload-download').then((module) => ({ default: module.FileUploadDownload })),
);
const ExcelUploadDownload = lazy(() =>
  import('@/pages/excel-upload-download').then((module) => ({
    default: module.ExcelUploadDownload,
  })),
);
const RoleManagement = lazy(() =>
  import('@/pages/role-management').then((module) => ({ default: module.RoleManagement })),
);

export const router = createBrowserRouter([
  {
    path: Router.SIGN_IN,
    element: <SignIn />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: Router.MAIN,
    element: <Main />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: Router.MY_PROFILE,
        element: <MyProfile />,
      },
      {
        path: Router.UI,
        element: <UiComponent />,
      },
      {
        path: Router.GRID_EXAMPLE,
        element: <GridExample />,
      },
      {
        path: Router.FILE_UPLOAD_DOWNLOAD,
        element: <FileUploadDownload />,
      },
      {
        path: Router.EXCEL_UPLOAD_DOWNLOAD,
        element: <ExcelUploadDownload />,
      },
      {
        path: Router.ROLE_MANAGEMENT,
        element: <RoleManagement />,
      },
    ],
  },
]);

const routerMappedIconName: Record<string, { icon: IconType; name: string }> = {
  [Router.UI]: { icon: RxComponent1, name: 'UI 컴포넌트' },
  [Router.GRID_EXAMPLE]: { icon: GoTable, name: '그리드 예시' },
  [Router.FILE_UPLOAD_DOWNLOAD]: { icon: FaRegFile, name: '파일 업로드/다운로드' },
  [Router.EXCEL_UPLOAD_DOWNLOAD]: { icon: RiFileExcel2Line, name: 'Excel 업로드/다운로드' },
  [Router.ROLE_MANAGEMENT]: { icon: MdOutlineManageAccounts, name: '메뉴/버튼 권한관리' },
  [Router.MY_PROFILE]: { icon: IoPersonCircleOutline, name: '내정보' },
};

const mainRouter = router.routes.find((route) => route.path === Router.MAIN);
const mainChildren = mainRouter?.children ?? [];

export const menus: TMenu[] = mainChildren.map((child) => {
  const menuIndex = Number(child.id?.split('-')[1] ?? '0');
  const childPath = child.path ?? '';

  return {
    menuIndex,
    name: routerMappedIconName[childPath].name,
    icon: routerMappedIconName[childPath].icon,
    router: childPath as Router,
    fullRouterPath: `${mainRouter?.path}/${child.path}`,
  };
});

export const sidebarMainMenus = menus.filter((menu) => menu.router !== Router.MY_PROFILE);
export const myProfileMenu = menus.find((menu) => menu.router === Router.MY_PROFILE);
