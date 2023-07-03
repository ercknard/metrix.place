import React from 'react';
import Pixel from './Pixel';
import styles from '../styles/Home.module.css';
import { RGBColor } from 'react-color';
import sharp from 'sharp';

interface EditGridProps {
  x: number;
  y: number;
  sector: [x: number, y: number];
  pixel: [x: number, y: number] | undefined;
  setPixel(pixel: [x: number, y: number] | undefined): void;
  color: RGBColor;
  setColor(color: RGBColor): void;
}
export default function EditGrid(props: EditGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    updatePixels();
  }, [props.pixel, props.color]);

  const updatePixels = async () => {
    // create a two dimensional array of Pixel components
    const data: number[] = [];
    console.log(`pixel: ${JSON.stringify(props.pixel)}`);
    const grid: typeof pixels = [];

    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 64; y++) {
        const r = data[x + y * 64];
        const g = data[x + y * 64 + 1];
        const b = data[x + y * 64 + 2];
        const a = data[x + y * 64 + 3];
        // TODO: get the color of the pixel from the db cache
        let color: RGBColor = { r, g, b, a };
        if (props.pixel && x === props.pixel[0] && y === props.pixel[1]) {
          color = props.color;
          props.setColor(props.color);
        }

        grid.push(
          <Pixel
            sector={props.sector}
            pixel={props.pixel}
            setPixel={props.setPixel}
            x={x}
            y={y}
            color={color}
            setColor={props.setColor}
            key={`${x}pixel${y}`}
          />
        );
      }
    }
    // set the grid
    setPixels(grid);
  };
  return (
    <div ref={ref} className={styles.grid}>
      {pixels}
    </div>
  );
}
