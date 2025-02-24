import { useEffect } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

import { hideLoading, showLoading, LoadingTypeBase } from '@/shared/components';
import { timeoutAction } from '@/shared/lib';

export function useQueryLoading({
  query,
  loadingType,
  loadingText,
  delayHideLoading = 0,
  isActiveOverlay = true,
  activeLoading = true,
}: {
  query: UseQueryResult;
  loadingType: LoadingTypeBase;
  loadingText?: string;
  delayHideLoading?: number;
  isActiveOverlay?: boolean;
  activeLoading?: boolean;
}) {
  useEffect(() => {
    if (!activeLoading) return;

    if (!query.isFetching) {
      timeoutAction(() => hideLoading(loadingType), delayHideLoading);
    } else if (query.isFetching) {
      showLoading(loadingType, loadingText, isActiveOverlay);
    }
  }, [query.isFetching, activeLoading]);
}
