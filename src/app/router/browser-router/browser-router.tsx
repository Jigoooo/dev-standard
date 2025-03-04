import { createBrowserRouter } from 'react-router-dom';

import { Router } from '@/entities/router';
import { RouteErrorPage } from '@/shared/components';
import { SignIn } from '@/pages/sign-in';
import { Main } from '@/pages/main';
import { UiComponent } from '@/pages/ui-component';
import { FileUploadDownload } from '@/pages/file-upload-download';
import { ExcelUploadDownload } from '@/pages/excel-upload-download';
import { MyProfile } from '@/pages/my-profile';
import { RoleManagement } from '@/pages/role-management';

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
