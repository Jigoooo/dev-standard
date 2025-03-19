import { TDataWithIndex } from '@/shared/ui';

export type RData<TData extends TDataWithIndex> = Omit<TData, 'index'>;

export type TValidationRuleWithHeaderId<TData = Record<string, any>> = {
  id: Extract<keyof TData, string>;
  validateFn: (value?: string | number | null) => boolean;
};
