import React from 'react';
import Sketch from 'react-color/lib/components/sketch/Sketch';
import { Accordion, Grid, Label } from 'semantic-ui-react';
import PaletteColor from './PaletteColor';

interface PalettePickerProps {}

export default function PalettePicker(props: PalettePickerProps): JSX.Element {
  return (
    <>
      <div
        className="palette-section"
        style={{ border: '1px solid yellow', height: '200px' }}
      >
        <Grid className="palette-grid-section">
          <Grid.Row>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
}
