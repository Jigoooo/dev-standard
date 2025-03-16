import { createContext } from 'react';

import { TAccordionGroupContext } from './accordion-type.ts';

export const AccordionGroupContext = createContext<TAccordionGroupContext>({});

// function useAccordionGroupContext() {
//   const context = use(AccordionGroupContext);
//   if (!context) {
//     throw new Error('Accordion must be used within a AccordionGroup');
//   }
//   return context;
// }
