import type { CSSProperties } from 'react';

export type SwitchProps = {
  containerStyle?: CSSProperties;
  label?: string;
  labelStyle?: CSSProperties;
  isOn: boolean;
  onClick: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
};
