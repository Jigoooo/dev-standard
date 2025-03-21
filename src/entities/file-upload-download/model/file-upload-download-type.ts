import { TDataWithIndex } from '@/shared/ui';

export type PFileListItem = {
  fileNm?: string;
};

export type RFileDownload = {
  fileUploadTitle: string;
  note: string;
  uploadDateTime: string;
  uploadUser: string;
};

export type TFileDownload = TDataWithIndex & RFileDownload;
