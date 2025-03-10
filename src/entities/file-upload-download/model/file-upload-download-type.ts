import { TDataWithIndex } from '@/shared/components';

export type RFileDownload = TDataWithIndex & {
  fileUploadTitle: string;
  note: string;
  uploadDateTime: string;
  uploadUser: string;
};
