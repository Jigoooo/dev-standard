import type { CSSProperties } from 'react';
import { Sketch } from '@uiw/react-color';

export function SketchColorPicker({
  style,
  hex,
  setHex,
}: {
  style?: CSSProperties | undefined;
  hex: string;
  setHex: (hex: string) => void;
}) {
  return (
    <Sketch
      style={{ ...{ marginLeft: 20 }, ...style }}
      color={hex}
      onChange={(color) => {
        setHex(color.hex);
      }}
    />
  );
}
