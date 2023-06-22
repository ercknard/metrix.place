import React from 'react';
import styles from '../styles/Home.module.css';
import MapSector from './MapSector';

interface MapGridProps {
  sector: number[] | undefined;
  setSector(sector: number[] | undefined): void;
  setPixel(pixel: number[] | undefined): void;
}
export default function MapGrid(props: MapGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [sectors, setSectors] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    updateSectors();
  }, [props.sector]);

  const updateSectors = () => {
    // create a two dimensional array of Pixel components
    console.log(`sector: ${JSON.stringify(props.sector)}`);
    const grid: typeof sectors = [];

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        let color = '#000000';
        if (props.sector && props.sector[0] === x && props.sector[1] === y) {
          color = '#111111';
        }
        // TODO: get the chunk of the sector from the db cache and fit it into the sector
        grid.push(
          <MapSector
            x={x}
            y={y}
            color={color}
            key={`${x}sector${y}`}
            sector={props.sector}
            setSector={props.setSector}
            setPixel={props.setPixel}
          />
        );
      }
    }
    // set the grid
    setSectors(grid);
  };
  return (
    <div ref={ref} className={styles.grid}>
      {sectors}
    </div>
  );
}
