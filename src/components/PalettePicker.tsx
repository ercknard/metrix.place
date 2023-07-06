import { encodeBase64, toUtf8Bytes } from 'ethers';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Button, Grid } from 'semantic-ui-react';
import PaletteColor from './PaletteColor';

interface PalettePickerProps {
  colors: string[];
}

export default function PalettePicker(props: PalettePickerProps): JSX.Element {
  const [cookie, setCookie] = useCookies(['metrix.place-palette']);

  const [palette, setPalette] = React.useState(
    [] as { id: string; color: string }[]
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    let i = 0;
    for (const c of props.colors) {
      palette[i] = { id: i.toString(), color: c };
      i++;
    }
    setLoading(false);
  }, [props.colors]);

  const colorChangeCallback = (id: string, color: string) => {
    const c = { id, color };
    palette[Number(id)] = c;
  };

  const savePalette = () => {
    setCookie(
      'metrix.place-palette',
      encodeBase64(toUtf8Bytes(JSON.stringify(palette))),
      {
        path: '/',
        //maxAge: 21600, // Expires after 6hr
        sameSite: true
        //secure: true
      }
    );
  };

  return (
    <>
      <div className="palette-section" style={{ height: '200px' }}>
        <Grid className="palette-grid-section">
          <Grid.Row>
            <Grid.Column>
              <PaletteColor
                paletteId="0"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[0]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="1"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[1]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="2"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[2]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="3"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[3]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="4"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[4]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PaletteColor
                paletteId="5"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[5]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="6"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[6]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="7"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[7]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="8"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[8]}
              />
            </Grid.Column>
            <Grid.Column>
              <PaletteColor
                paletteId="9"
                colorChangeCallback={colorChangeCallback}
                color={props.colors[9]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column style={{ minWidth: '100%' }}>
              <Button
                content="Save"
                style={{
                  width: '10rem',
                  fontFamily: 'VT323',
                  fontWeight: 'normal',
                  fontSize: '1.4rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem'
                }}
                onClick={savePalette}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
}
