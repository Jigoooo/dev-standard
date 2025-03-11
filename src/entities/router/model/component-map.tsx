import { ComponentType, lazy, LazyExoticComponent } from 'react';
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

export const componentMap: Partial<Record<Router, LazyExoticComponent<ComponentType<any>>>> = {
  [Router.UI]: UiComponent,
  [Router.GRID_EXAMPLE]: GridExample,
  [Router.FILE_UPLOAD_DOWNLOAD]: FileUploadDownload,
  [Router.EXCEL_UPLOAD_DOWNLOAD]: ExcelUploadDownload,
  [Router.ROLE_MANAGEMENT]: RoleManagement,
};
