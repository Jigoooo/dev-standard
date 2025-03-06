import { useVirtualizer, PartialKeys, VirtualizerOptions } from '@tanstack/react-virtual';

export function useVirtualRow<TScrollElement extends Element, TItemElement extends Element>(
  options: PartialKeys<
    VirtualizerOptions<TScrollElement, TItemElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
  >,
) {
  // 'use no memo';

  return useVirtualizer(options);
}
