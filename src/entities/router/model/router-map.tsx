import { ComponentType, lazy, LazyExoticComponent } from 'react';
import { IconType } from 'react-icons';

import { RxComponent1 } from 'react-icons/rx';
import { GoTable } from 'react-icons/go';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { FaRegFile } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { FaUikit } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';

import { Router } from '@/entities/router';

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

// function toPascalCase(str: string): string {
//   return str
//     .split('-')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join('');
// }
// export function lazyLoadComponent(key: string) {
//   const componentName = toPascalCase(key);
//   return lazy(() =>
//     import(`@/pages/${key}`).then((module) => ({ default: module[componentName] })),
//   );
// }

export const routerComponentMap: Partial<Record<Router, LazyExoticComponent<ComponentType<any>>>> =
  {
    [Router.UI]: UiComponent,
    [Router.GRID_EXAMPLE]: GridExample,
    [Router.FILE_UPLOAD_DOWNLOAD]: FileUploadDownload,
    [Router.EXCEL_UPLOAD_DOWNLOAD]: ExcelUploadDownload,
    [Router.ROLE_MANAGEMENT]: RoleManagement,
  };

export const routerMappedIcon: Record<string, IconType> = {
  [Router.COMPONENT]: FaUikit,
  [Router.UI]: RxComponent1,
  [Router.GRID_EXAMPLE]: GoTable,
  [Router.FILE]: HiArrowsUpDown,
  [Router.FILE_UPLOAD_DOWNLOAD]: FaRegFile,
  [Router.EXCEL_UPLOAD_DOWNLOAD]: RiFileExcel2Line,
  [Router.MANAGER]: IoSettingsSharp,
  [Router.ROLE_MANAGEMENT]: MdOutlineManageAccounts,
  [Router.MY_PROFILE]: IoPersonCircleOutline,
};
