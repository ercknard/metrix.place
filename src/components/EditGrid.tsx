import React from 'react';
import Pixel from './Pixel';
import styles from '../styles/Home.module.css';

interface EditGridProps {
  x: number;
  y: number;
}
export default function EditGrid(props: EditGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    // create a two dimensional array of Pixel components
    const grid: typeof pixels = [];

    for (let x = 1; x <= 64; x++) {
      for (let y = 1; y <= 64; y++) {
        let color = '#000000';
        // TODO: get the color of the pixel from the db cache
        grid.push(<Pixel x={x} y={y} color={color} key={`${x}pixel${y}`} />);
      }
    }
    // set the grid
    setPixels(grid);
  }, []);
  return (
    <div ref={ref} className={styles.grid}>
      {pixels}
    </div>
  );
}
