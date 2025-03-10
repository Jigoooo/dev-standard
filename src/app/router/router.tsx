import { ComponentType, lazy, LazyExoticComponent } from 'react';
import { RouteObject } from 'react-router-dom';

import { Router } from '@/entities/router';
import { TMenu } from '@/entities/menu';

export const routeComponentMap: { [key: string]: LazyExoticComponent<ComponentType<any>> } = {
  [Router.UI]: lazy(() =>
    import('@/pages/ui-component').then((module) => ({ default: module.UiComponent })),
  ),
  [Router.GRID_EXAMPLE]: lazy(() =>
    import('@/pages/grid-example').then((module) => ({ default: module.GridExample })),
  ),
  [Router.FILE_UPLOAD_DOWNLOAD]: lazy(() =>
    import('@/pages/file-upload-download').then((module) => ({
      default: module.FileUploadDownload,
    })),
  ),
  [Router.EXCEL_UPLOAD_DOWNLOAD]: lazy(() =>
    import('@/pages/excel-upload-download').then((module) => ({
      default: module.ExcelUploadDownload,
    })),
  ),
  [Router.ROLE_MANAGEMENT]: lazy(() =>
    import('@/pages/role-management').then((module) => ({ default: module.RoleManagement })),
  ),
};

export function generateRoutesFromMenu(menus: TMenu[]): RouteObject[] {
  return menus.map((menu) => {
    const RouteElement = routeComponentMap[menu.router];
    const route: RouteObject = {
      path: menu.router,
      element: <RouteElement />,
    };

    if (menu.children && menu.children.length > 0) {
      route.children = generateRoutesFromMenu(menu.children);
    }

    return route;
  });
}
