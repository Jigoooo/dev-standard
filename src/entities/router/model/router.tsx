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
import { GridExample } from '@/pages/grid-example';

const MyProfile = lazy(() =>
  import('@/pages/my-profile').then((module) => ({ default: module.MyProfile })),
);
const UiComponent = lazy(() =>
  import('@/pages/ui-component').then((module) => ({ default: module.UiComponent })),
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

export const sidebarMainMenus: TMenu[] = [
  {
    menuIndex: 0,
    name: 'UI 컴포넌트',
    icon: RxComponent1,
    router: Router.UI,
    fullRouterPath: `${Router.MAIN}/${Router.UI}`,
  },
  {
    menuIndex: 1,
    name: '그리드 예시',
    icon: GoTable,
    router: Router.GRID_EXAMPLE,
    fullRouterPath: `${Router.MAIN}/${Router.GRID_EXAMPLE}`,
  },
  {
    menuIndex: 2,
    name: '파일 업로드/다운로드',
    icon: FaRegFile,
    router: Router.FILE_UPLOAD_DOWNLOAD,
    fullRouterPath: `${Router.MAIN}/${Router.FILE_UPLOAD_DOWNLOAD}`,
  },
  {
    menuIndex: 3,
    name: '엑셀 업로드/다운로드',
    icon: RiFileExcel2Line,
    router: Router.EXCEL_UPLOAD_DOWNLOAD,
    fullRouterPath: `${Router.MAIN}/${Router.EXCEL_UPLOAD_DOWNLOAD}`,
  },
  {
    menuIndex: 4,
    name: '메뉴/버튼 권한관리',
    icon: MdOutlineManageAccounts,
    router: Router.ROLE_MANAGEMENT,
    fullRouterPath: `${Router.MAIN}/${Router.ROLE_MANAGEMENT}`,
  },
] as const;

export const myProfileMenu: TMenu = {
  menuIndex: 9999,
  name: '내 정보',
  icon: IoPersonCircleOutline,
  router: Router.MY_PROFILE,
  fullRouterPath: `${Router.MAIN}/${Router.MY_PROFILE}`,
};

export const menus = [...sidebarMainMenus, myProfileMenu];
