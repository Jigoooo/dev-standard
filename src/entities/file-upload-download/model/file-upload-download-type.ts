import { TDataWithIndex } from '@/shared/ui';

export type PFileListItem = {
  fileNm?: string;
};

export type RFileListItem = {
  fileIdx: number;
  fileNm: string;
  fileSize: number;
  insDt: string;
  insMember: string;
};

export type RFileList = {
  fileList: RFileListItem[];
};

export type TFileListItem = TDataWithIndex & RFileListItem;
