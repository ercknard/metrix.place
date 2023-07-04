import React from 'react';
import Chrome from 'react-color/lib/components/chrome/Chrome';
import { Accordion, Grid, Label, Popup } from 'semantic-ui-react';

interface PaletteColorProps {}

export default function PaletteColor(props: PaletteColorProps): JSX.Element {
  return (
    <>
      <Popup
        content={
          <div>
            <Chrome />
          </div>
        }
        on="click"
        popper={{ id: 'palette-container', style: { zIndex: 2000 } }}
        trigger={
          <Label
            color="yellow"
            style={{ height: '32px', width: '32px' }}
          ></Label>
        }
      />
    </>
  );
}
