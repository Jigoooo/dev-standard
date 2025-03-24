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
import { RiListSettingsFill } from 'react-icons/ri';

import { Router } from './router-type.ts';

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
const MenuSetting = lazy(() =>
  import('@/pages/menu-setting').then((module) => ({ default: module.MenuSetting })),
);

export function getRouterComponent(
  router: Router,
): LazyExoticComponent<ComponentType<any>> | undefined {
  const mapping: Partial<Record<Router, LazyExoticComponent<ComponentType<any>>>> = {
    [Router.UI]: UiComponent,
    [Router.GRID_EXAMPLE]: GridExample,
    [Router.FILE_UPLOAD_DOWNLOAD]: FileUploadDownload,
    [Router.EXCEL_UPLOAD_DOWNLOAD]: ExcelUploadDownload,
    [Router.ROLE_MANAGEMENT]: RoleManagement,
    [Router.MENU_SETTING]: MenuSetting,
  };

  return mapping[router];
}

export function getRouterMappedIcon(router: Router): IconType | undefined {
  const mapping: Record<string, IconType> = {
    [Router.COMPONENT]: FaUikit,
    [Router.UI]: RxComponent1,
    [Router.GRID_EXAMPLE]: GoTable,
    [Router.FILE]: HiArrowsUpDown,
    [Router.FILE_UPLOAD_DOWNLOAD]: FaRegFile,
    [Router.EXCEL_UPLOAD_DOWNLOAD]: RiFileExcel2Line,
    [Router.MANAGER]: IoSettingsSharp,
    [Router.ROLE_MANAGEMENT]: MdOutlineManageAccounts,
    [Router.MENU_SETTING]: RiListSettingsFill,
    [Router.MY_PROFILE]: IoPersonCircleOutline,
  };

  return mapping[router];
}
