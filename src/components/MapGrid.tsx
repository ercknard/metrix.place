import React from 'react';
import styles from '../styles/Home.module.css';
import MapSector from './MapSector';

interface MapGridProps {}
export default function MapGrid(props: MapGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [sectors, setSectors] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    // create a two dimensional array of Pixel components
    const grid: typeof sectors = [];

    for (let x = 1; x <= 16; x++) {
      console.log(x);

      for (let y = 1; y <= 16; y++) {
        console.log(y);
        grid.push(<MapSector x={x} y={y} color="#fff" />);
      }
    }
    console.log(grid.length);
    // set the grid
    setSectors(grid);
  }, []);
  return (
    <div ref={ref} className={styles.grid}>
      {sectors}
    </div>
  );
}
