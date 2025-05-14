import type { DataWithIndex } from '@/shared/ui';
import type { FileListItemResponse } from '@/shared/api';

export type FileListItem = DataWithIndex & FileListItemResponse;
