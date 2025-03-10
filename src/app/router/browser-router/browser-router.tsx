import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Router } from '@/entities/router';
import { RouteErrorPage } from '@/shared/components';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { GridExample } from 'pages/grid-example';
// import { MyProfile } from '@/pages/my-profile';
// import { UiComponent } from '@/pages/ui-component';
// import { FileUploadDownload } from '@/pages/file-upload-download';
// import { ExcelUploadDownload } from '@/pages/excel-upload-download';

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

export const browserRouter = createBrowserRouter([
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
