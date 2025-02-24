import { CSSProperties } from 'react';
import Circle from '@uiw/react-color-circle';

export function FuturCircleColorPicker({
  style,
  hex,
  setHex,
}: {
  style?: CSSProperties | undefined;
  hex: string;
  setHex: (hex: string) => void;
}) {
  return (
    <Circle
      style={style}
      colors={[]}
      color={hex}
      pointProps={{
        style: {
          marginRight: 20,
        },
      }}
      onChange={(color) => {
        setHex(color.hex);
      }}
    />
  );
}
