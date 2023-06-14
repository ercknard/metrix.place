import React from 'react';
import Pixel from './Pixel';
import styles from '../styles/Home.module.css';
import { Grid } from 'semantic-ui-react';

interface EditGridProps {}
export default function EditGrid(props: EditGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    // create a two dimensional array of Pixel components
    const grid: typeof pixels = [];

    for (let x = 1; x <= 64; x++) {
      console.log(x);

      for (let y = 1; y <= 64; y++) {
        console.log(y);
        grid.push(<Pixel x={x} y={y} color="#fff" />);
      }
    }
    console.log(grid.length);
    // set the grid
    setPixels(grid);
  }, []);
  return (
    <div ref={ref} className={styles.grid}>
      {pixels}
    </div>
  );
}
