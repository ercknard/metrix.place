import React from 'react';
import { ColorResult } from 'react-color';
import Chrome from 'react-color/lib/components/chrome/Chrome';
import { Label, Popup } from 'semantic-ui-react';

interface PaletteColorProps {
  paletteId: string;
  color: string;
  colorChangeCallback(id: string, color: string): void;
}

export default function PaletteColor(props: PaletteColorProps): JSX.Element {
  const [color, setColor] = React.useState(props.color as undefined | string);

  const handleChange = (
    newColor: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColor(newColor.hex);
    props.colorChangeCallback(props.paletteId, newColor.hex);
  };

  return (
    <>
      <Popup
        inverted
        content={
          <div>
            <Chrome
              disableAlpha
              color={color}
              onChangeComplete={handleChange}
            />
          </div>
        }
        style={{
          padding: '0.6em'
        }}
        on="click"
        popper={{ id: 'palette-container', style: { zIndex: 2000 } }}
        trigger={
          <Label
            style={{ height: '32px', width: '32px', background: color }}
          ></Label>
        }
      />
    </>
  );
}
