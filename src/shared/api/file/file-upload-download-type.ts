import type { DataWithIndex } from '@/shared/ui';

export type FileListItemParameter = {
  fileNm?: string;
  fromDate: string;
  toDate: string;
};

export type FileListItemResponse = {
  fileIdx: number;
  fileNm: string;
  fileSize: number;
  insDt: string;
  insMember: string;
};

export type FileListResponse = {
  fileList: FileListItemResponse[];
};

export type FileListItem = DataWithIndex & FileListItemResponse;

export type FileDownloadParameter = {
  fileIdx: number;
};

export type FileSaveListParameter = {
  fileList: File[];
};

export type DeleteFileListParameter = {
  deleteFileList: number[];
};
