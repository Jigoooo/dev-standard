import type { CSSProperties, ReactNode } from 'react';

import { FlexColumn } from '@/shared/ui';
import { AccordionGroupContext } from '../model/accordion-group-context.ts';
import type { TAccordionType } from '../model/accordion-type.ts';

export function AccordionGroup({
  type = 'single',
  style,
  children,
}: {
  type?: TAccordionType;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <AccordionGroupContext value={{ type }}>
      <FlexColumn
        style={{
          userSelect: 'none',
          gap: 16,
          ...style,
        }}
      >
        {children}
      </FlexColumn>
    </AccordionGroupContext>
  );
}
