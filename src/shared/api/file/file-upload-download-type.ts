import type { DataWithIndex } from '@/shared/ui';

export type FilesParameter = {
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

export type FilesResponse = {
  fileList: FileListItemResponse[];
};

export type FileListItem = DataWithIndex & FileListItemResponse;

export type FileDownloadParameter = {
  fileIdx: number;
};

export type FileSaveParameter = {
  fileList: File[];
};

export type DeleteFileParameter = {
  deleteFileList: number[];
};
