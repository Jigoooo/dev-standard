import { THeader } from '@/shared/ui';
import { createHeader } from './create-header.ts';

export function createHeaderFromId<TData, K extends Extract<keyof TData, string>>(
  headerKeyLabels: Map<K, string>,
  id: K,
  width: number,
  extra: Partial<THeader<TData>> = {},
): THeader<TData> {
  const label = headerKeyLabels.get(id) ?? id;
  return createHeader(id, label, width, extra);
}
