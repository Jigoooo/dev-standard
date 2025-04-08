import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import type { ForwardRefComponent, MotionProps } from 'framer-motion';
import type { Placement } from '@floating-ui/react';

export type FlexRowProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> &
        MotionProps & { as: E; ref?: Ref<any> | null; children?: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; ref?: Ref<any> | null; children?: ReactNode };

export type FlexColumnProps<E extends ElementType> =
  E extends ForwardRefComponent<any, any>
    ? HTMLAttributes<HTMLElement> &
        MotionProps & { as: E; ref?: Ref<any> | null; children?: ReactNode }
    : HTMLAttributes<HTMLElement> & { as?: E; ref?: Ref<any> | null; children?: ReactNode };

export type TooltipProps = {
  style?: CSSProperties;
  placement: Placement;
  children: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};
