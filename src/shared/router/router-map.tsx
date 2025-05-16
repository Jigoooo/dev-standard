import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';
import type { IconType } from 'react-icons';

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
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { Router } from '@/shared/router/index.ts';

export function getRouterMappedIcon(router: Router): IconType | undefined {
  const mapping: Record<string, IconType> = {
    [Router.COMPONENT]: FaUikit,
    [Router.UI]: RxComponent1,
    [Router.GRID_EXAMPLE]: GoTable,
    [Router.FILE]: HiArrowsUpDown,
    [Router.FILE_UPLOAD_DOWNLOAD]: FaRegFile,
    [Router.EXCEL_UPLOAD_DOWNLOAD]: RiFileExcel2Line,
    [Router.MANAGER]: IoSettingsSharp,
    [Router.ROLE_MANAGEMENT]: MdOutlineAdminPanelSettings,
    [Router.MENU_SETTING]: RiListSettingsFill,
    [Router.MY_PROFILE]: IoPersonCircleOutline,
    [Router.USER_MANAGEMENT]: MdOutlineManageAccounts,
  };

  return mapping[router];
}

const pageModules = import.meta.glob<{ [exportName: string]: ComponentType<any> }>(
  '/src/pages/**/*.tsx',
);

export function getRouterComponent(
  router: Router,
  componentName?: string,
): LazyExoticComponent<ComponentType<any>> | undefined {
  if (!componentName) return undefined;

  const importPath = `/src/pages/${router}/ui/${router}.tsx`;
  const loader = pageModules[importPath];

  if (!loader) return undefined;

  return lazy(async () => {
    const mod = await loader();
    const Component = (mod as any)[router];
    console.log(Component);
    return { default: Component };
  });
}
