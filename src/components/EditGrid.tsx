import React from 'react';
import Pixel from './Pixel';
import styles from '../styles/Home.module.css';

interface EditGridProps {
  x: number;
  y: number;
  sector: [x: number, y: number];
  pixel: [x: number, y: number] | undefined;
  setPixel(pixel: [x: number, y: number] | undefined): void;
}
export default function EditGrid(props: EditGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    updatePixels();
  }, [props.pixel]);

  const updatePixels = () => {
    // create a two dimensional array of Pixel components
    console.log(`pixel: ${JSON.stringify(props.pixel)}`);
    const grid: typeof pixels = [];

    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 64; y++) {
        const r = `${BigInt(x * 4).toString(16)}`;
        const g = `${(BigInt(y * 2) + BigInt(y * 2)).toString(16)}`;
        const b = `${BigInt(x * 4).toString(16)}`;
        let color = `#${r.length == 2 ? r : `0${r}`}${
          g.length == 2 ? g : `0${g}`
        }${b.length == 2 ? b : `0${b}`}`;
        console.log(color);
        // TODO: get the color of the pixel from the db cache
        grid.push(
          <Pixel
            sector={props.sector}
            pixel={props.pixel}
            setPixel={props.setPixel}
            x={x}
            y={y}
            color={color}
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
