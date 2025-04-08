import type { PartialKeys, VirtualizerOptions } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';

export function useVirtualRow<TScrollElement extends Element, TItemElement extends Element>(
  options: PartialKeys<
    VirtualizerOptions<TScrollElement, TItemElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
  >,
) {
  return useVirtualizer(options);
}
